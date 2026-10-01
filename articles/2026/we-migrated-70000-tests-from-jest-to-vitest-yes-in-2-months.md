---
title: We migrated 70,000 tests from Jest to Vitest. Yes, in 2 months.
image: https://res.cloudinary.com/n0th1ngelse/image/upload/v1697661181/blog/jest-to-vitest/OAbPhQROcsaWusXjdVxc.jpg
description:
  Jest ran 70,000 tests at 13 tests/sec with constant OOMs on CI. Here I explain how we migrated Miro's frontend monorepo to
  Vitest in 2 months with AI agents, achieving 50% faster runs and 30% less memory usage.
language: en
date: 2026-10-01
keywords:
  - Jest
  - Vitest
  - Testing
  - Monorepo
  - AIAgents
  - DeveloperExperience
reposts:
  - medium
  - dev.to
draft: true
---

![Article preview image](https://res.cloudinary.com/n0th1ngelse/image/upload/v1697661181/blog/jest-to-vitest/OAbPhQROcsaWusXjdVxc.jpg)

YOU got it right. We migrated 70,000 tests (reads: 70 thousand) from Jest to Vitest. The logical question would be: how? And
here is where the story begins.  
I work as a software engineer in the Frontend Developer Experience team at [Miro](http://miro.com). Our ownership covers
various parts of the platform. One of the major focuses for us is frontend infrastructure and tooling \- everything that
makes the product teams at Miro fast and productive. 2026 was indeed a pivotal year for us: we were finally able to kill
Angular.js (I know, right), switched from Prettier to Oxfmt, got rid of ESLint in favor of Oxlint, we are running the CI
typechecking with TypeScript 7 and much more. But look, you are here to read about unit-tests\! In this article, I will cover
how we migrated the main Miro frontend application unit testing harness from Jest to Vitest.

## The beginning

The main Miro application is constantly evolving and sits now at \~6 million LoC. At this scale, the regular approaches and
tooling stop functioning. How can I tell? Here are some facts about our CI state, unit-test jobs specifically:

- We run 6 CI runners in parallel **just for unit-tests**. Each runner takes up to 20 minutes to finish
- For Jest 30 the average speed is \~13 tests per second, even with [SWC](https://swc.rs/docs/usage/jest) as the code parser
- 25% of all runs are failing because of memory leaks, i.e. the CI runners are dying with OOM errors
- We had to apply specific patches for Jest core packages to maintain a better worker pool
  ([were never accepted upstream](https://github.com/jestjs/jest/issues/14818))
- Migrating from Jest 29 to Jest 30 (yes, the first major release in 3 years) gave us only around 5% speed and memory
  improvements

This does not look bright, and it has a big impact on the new releases for our application. But what could we do about that?

Lurking through the Slack messages, I found a few threads where we actually discussed if we want to migrate away from Jest.
Back in November 2023, one of my colleagues wrote:

> Although I’ve spent some time also exploring an alternative (vitest) but I’ve found that in practice the extra set of
> vitest specific configurations and replicating our current build might be too risky, without knowing how much speed
> benefits we get now that we’re relying on @swc/jest

At that moment, the scale of the problem was manageable \- we just started to run the unit-tests in parallel on CI,
compensating for the waiting time with the compute power from extra runners. Worked pretty well.  
In July 2024, another colleague of mine made a remark regarding the unit-test tooling one more time:

> I expect higher returns from better test selection (e.g. not running 35k unit tests each time). The cost of switching to
> vitest (for example) is high and unclear what the improvement is

Fair enough\! 6 runners for 35,000 tests in parallel took just around 7 minutes each. With job durations like this, we had
much bigger problems to solve, think of end-to-end tests, for example.

## The problem

Fast forward to March 2025\. We started facing more and more issues with the Jest stack for testing. Let me give just one
example that triggered me to explore the alternatives to Jest. Apparently, our engineers reported that with the
[VSCode Jest extension](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest), multiple versions of
[fb-watchman](https://www.npmjs.com/package/fb-watchman) (Jest’s in-house filesystem watcher library) were installed, which
led to CPU saturation and, as a result, the inability to use their laptops. We figured out how to fix it with
[watchman: false](https://jestjs.io/docs/configuration#watchman-boolean). At that moment, Ahmed, a Principal engineer in the
Frontend Developer Experience team, had enough:

> I want to say maybe it's time to switch to vitest, but that's a massive effort…

We had a conversation regarding this, but I had no capacity to lead the migration right away. We also saw a lot of traction
regarding the AI models and how they rapidly evolve for more and more complex problems. All signs were to wait for a bit. And
this is how we landed in 2026\.

Now you may ask: “Sergey, why did you decide to explore the migration again, considering all the facts you just mentioned?”
Don’t get me wrong, we are not solving problems of this scale just because it’s cool. We need to understand what we want to
achieve. I will start from the facts first:

The main Miro application is a monorepo, that includes both web and native parts. It is managed by
[yarn](https://yarnpkg.com/) and [NX](https://nx.dev/). At the beginning of 2026, we had 800+ packages in our codebase. The
largest code share is located in the web core, which accounts for around 20% of the codebase. We also had \~70,000 unit-tests
(doubled in 2 years, imagine that) and the unit-tests jobs were taking up to 20 minutes on average to finish, which made them
the slowest CI jobs in our pipeline, even worse than building the application and running the e2e tests on the new version\!

Now, we can already see a few pain points we are fighting against. I can compile the whole list for you:

1. CI runners memory limit. 25% of the runs are failing because of memory leaks
2. Even with the SWC parser, Jest is slow, at 13 tests/sec for us (we use JSDOM and canvas mock for testing)
3. The TypeScript compatibility is not excellent. There are still API methods that infer the `any` type.
4. There is no proper ESM support, no mock hoisting. We add the spying code and mock factories between the top-level imports,
   so the import statements are downleveled to `require()` and can pick the mocked implementation.
5. Because of the previous point, we still transform the code to CommonJS. This means we are not testing what we are
   delivering to our customers (we deliver the ESM bundles).
6. The test coverage report is inaccurate. The packages do not share the instrumentation outside of each project root
   directory. This effectively means that there is missing cross-package coverage.
7. No test isolation. The jest workers in the pool are not spawned for each module; rather, they are recycled once a worker
   hits the memory limit.
8. There are no guardrails for the test fixtures to prevent leaking into the production bundle (funny spoiler: some teams
   actually used the test fixtures in the production code, intentionally)
9. Let's be real, it took Jest 3 years to release a new major version. We have opened a few issues on GitHub, but we did not
   see any traction around it.
10. Not only us, did I mention the incompatibility with other popular libraries?
    [Prettier, for example](https://github.com/jestjs/jest/issues/15816).

I can go on and on, but I think this is already impressive.  
Now, you cannot just take 70k tests and rewrite them with a random testing framework (imagine you could\!). You also have to
educate hundreds of product engineers, and the scale of the change would be massive. And also, how about all the custom
plugins, matchers, and supporting dependencies? Think of `jest-axe`, `jest-when`, React Testing Library, and others. The
answer to all of this is \- we are looking for a Jest-compatible api. Compatible enough so we won’t turn our monorepo into
chaos.

## Where to migrate?

Now, the market research gave us two alternatives: Rstest and Vitest (versions as of March 2026):

#### **RStest v0.9.8 ([https\://rstest.rs](https://rstest.rs/))**

- Part of [Rstack toolchain](https://rspack.rs/), so we can reuse the Rspack configuration from our application
- Modern ESM-based syntax (think of
  [import attributes](https://rstest.rs/api/runtime-api/rstest/mock-modules#partial-mock-with-importactual) and more explicit
  mocking syntax)
- Integration with Rsdoctor for debugging

#### **Vitest v4.1.6 ([https\://vitest.dev](https://vitest.dev/))**

- Wide community adoption
- Type safety and ESM-first
- Test isolation and rich, comprehensive api

You can guess Vitest won, but why? I did my homework: I created two branches and migrated around 10k tests to each of the
frameworks. Then I tried to execute the tests in different modes. Here are the results, (the values are tests per second, the
bigger, the better):

|                             | Jest       | Vitest     | Rstest    |
| :-------------------------- | :--------- | :--------- | :-------- |
| **Local run**               | 14.7 t/sec | 16.8 t/sec | 7.6 t/sec |
| **Local run with coverage** | 5.9 t/sec  | 8 t/sec    | 2.9 t/sec |
| **CI run**                  | 12.9 t/sec | 13 t/sec   | OOM       |
| **CI run with coverage**    | 5 t/sec    | 8.6 t/sec  | OOM       |

You can already notice that Rstest failed to run on CI, mainly because of bad memory management in the worker pool. Keep in
mind that it was pre-1.0 version and the runner is under active development, so the hopes were low (I encourage you to try
the latest version and explore the current state of things). In the meantime, migrating this small test subset showed a huge
difference in memory consumption for Vitest \- more than 10GB less memory used on the runner compared to the same group of
tests in Jest 🚀.  
Just to be honest here, the speed and RAM consumption were indeed among the main factors. And although the research did not
show any meaningful speed improvements, we decided to execute the migration as we saw opportunities to optimize Vitest
configuration and try to make it faster. It also covers other pain points we were targeting to solve. Yes, we have a
front-runner, and we are now coming to a plan\!

## The plan

As I said already, the Miro web application is a monorepo orchestrated by NX and Yarn. It combines the web core monolith,
holding \~20% of all the code. Other parts are: 800+ packages and the part for native applications. And since the native part
has its own CI and release pipeline, we decided to leave it out of scope.  
On a separate note, the application accepts 60+ merges into the main branch on a daily basis. And as much as I wanted to
“just” ask the AI agents to migrate everything in one go, it was not possible for us to execute. I decided to go with a
gradual rollout:

1. Run both Jest and Vitest on separate runners on CI in parallel. As the migration goes, reallocate the runners depending on
   the share of migrated tests
2. Start with packages. This way, we will be able to deliver the meaningful parts, and it is easy to discover which tests
   should go to Jest and which to Vitest.
3. Use AI agents to migrate the tests. We create a skill for the agents in the repo, so the agents have all necessary
   context. After each migration phase, we update our patterns not mentioned in the skill files.

The last bit is the most powerful. Now, the agents learn and remember new patterns. This makes the migration faster and
produces fewer hallucinations with each iteration. This also makes the migration more consistent \- the agents apply the same
patterns they saw before. Not only that, once completed, you will end up having a huge list of very specific code examples
the agents found in the tests \- an amazing source of insights to reflect on. It can easily open the room for follow-ups,
good practices, and knowledge sharing.

### Act 1 \- Infrastructure

I started with infrastructure for Vitest. The basics include having the very first version of Vitest config to reuse in the
application.  
Then we added the compatibility bridges. Think about shared mocks and helpers that create the fake data. During the time of
migration, we do not want to duplicate such files. Hence, we added the shim `globalThis.jest = vi` in Vitest config. And
`globalThis.vi = jest` in Jest. Yes, the api is not 100% compatible, but this was enough in our case.  
Now the whole idea of migration was built around a gradual switch package by package. Each package runs the scripts via the
CLI commands, think of it as having a command `miro-scripts test`. It took me to add the runner’s opt-in argument, so we can
distinguish which test runner to spawn. Looks like this: `miro-scripts test --runner=vitest` in the package.json file.  
It was not just a local story. This flag allowed us to see how to run these tests on CI runners. As we specialized the
runners per tool, we combined all Vitest projects into one pool of runners, and the rest was for the remaining Jest
projects.  
Finally, we adjusted the observability metrics in order to track the progress and test distribution. We added the extra
`runner` label for test-related Prometheus metrics, which made it possible to visualize the migration.

### Act 2 \- First steps

Now we were all set to start the actual migration. All guardrails were there, the CI picked up all the tests, so we were not
losing quality. The only missing part was test coverage for Vitest, but we agreed to handle it after the transition.  
I started with small packages. This allowed us to keep the pull-requests size manageable. This way I could:

1. Review the changes more precisely (as I said, on the later stages, the built context was so rich that it could hardly
   produce off-track changes)
2. Form the foundation of the AI skill. First instructions, patterns, and polyfills were missing in the config
3. Convince teams and build trust. We, as a Frontend Developer Experience team, knew we needed to modernise the tech stack.
   But it was not obvious for the product teams. I made sure to be vocal about the migration and tried to iterate on the
   reasoning behind the change
4. Start collecting issues. For example, there were
   [some extensions in VSCode](https://github.com/firsttris/vscode-jest-runner) that tried to guess the test framework used
   in the repo by the root-level config. With both Jest and Vitest configs at the root, it gave priority to Vitest, which at
   that time had only a fraction of packages with completed migration \- just one of those things that I could only assume at
   the beginning.

Once the first version of the AI skill was ready, I made sure to focus on the community work, presenting on it internally and
explaining how each team could DIY their own migration. The skill is in the repo, just ask your agent to migrate the packages
under your ownership\! ✨

### Act 3 \- Goes well

We started off strong with the migration. The first 90 packages went pretty well. At this moment, we built the needed Vitest
plugins to cover parts of Jest configuration and added a decent amount of global polyfills. I intentionally did not ask the
AI agents to mirror the Jest config \- nobody touched it for years, and it absorbed so much legacy, I did not want to port it
to Vitest and started from scratch. I also tried to run the migration based on ownership, i.e. in a single pull-request I
would only transform tests for the single owning team. Unfortunately, this did not work as expected. We have so many
cross-package helpers and fixture generators, so it was never a single team, rather a few owners here and there. But that was
still acceptable to us.  
At that point, I felt so confident that I decided to take one of the biggest packages in our repo (apart from the web
monolith). \~600 test files all at once, a true battle test for the migration flow. BOOM, we landed it in the main branch\!
It was a huge milestone and proof we could continue.  
On another side, we kept working with the frontend community and were very transparent about the effort. As a result, we
started receiving positive feedback about the progress in general and how smooth the migration was going.

### Act 4 \- It couldn’t be _that_ easy

Although the mechanical migration was progressing well, our responsibility never changed \- stable CI processes. Not only did
we need to migrate the code, but we also needed to follow the metrics. Unfortunately, the metrics started showing a coming
disaster.  
The CI runner started consuming more and more memory. I was confused\! My initial research gave me the signal that Vitest
consumed much **LESS** memory, but we were around 50% of the way through the migration, and it was getting only worse?\! We
had to pause everything until we figured it out. Imagine my mental state at that time: we were in the middle of a transition.
I couldn’t roll everything back, but I also could not move on. What do I do now? Did I fail?\!  
I was buried in the problem for days until I came to the realisation:  
Each package in the repository is defined as a [Vitest project](https://vitest.dev/guide/projects.html) (for simplicity, I
will use the terms package and project interchangeably). Turns out,
[Vitest projects do not share the transformation cache](https://github.com/vitest-dev/vitest/discussions/10572)\! Every
project builds up the cache with a unique identifier under the hood. If packages are heavily interconnected, Vitest spawns a
Vite server for each package and transforms the same module graph again and again. So 10 linked packages will transform the
same modules 10 times. Now scale it up to 800 packages, and you will get it. And in my initial research, I only used the
subset of the tests inside a single Vitest project, thus, I could not actually see it coming.  
The solution is to run fewer projects, not by ignoring some of them, but rather by merging the projects into a single
instance. Fortunately, most of the packages in our application have the default shared Vitest config with no overrides. So it
was easy to write a project discovery script that would combine all packages with default configuration into a single
project. By doing this, we were able to run only 60 Vitest projects that actually account for 400 packages (59 custom
projects \+ 1 project that includes the remaining files).  
I will give you a sneak peek with the numbers:

| Metric             | Before    | After     | Delta      | % Change |
| :----------------- | :-------- | :-------- | :--------- | :------- |
| **Heap Memory**    | 8,770 MB  | 5,024 MB  | \-3,746 MB | \-42.71% |
| **Total Memory**   | 21,403 MB | 18,564 MB | \-2,839 MB | \-13.26% |
| **Total Duration** | 1059.83s  | 611.06s   | \-448.77s  | \-42.34% |
| Transform Time     | 10756.03s | 4327.69s  | \-6428.34s | \-59.76% |
| Setup Time         | 1495.36s  | 1277.27s  | \-218.09s  | \-14.58% |
| Import Time        | 13452.26s | 6984.71s  | \-6467.55s | \-48.08% |
| Tests Time         | 257.29s   | 262.76s   | \+5.47s    | \+2.13%  |
| Environment Time   | 344.18s   | 371.06s   | \+26.88s   | \+7.81%  |

Curious readers may ask: why did Environment time and Test time increase? Imagine you run 10 Vitest workers in parallel. And
only a single main process that runs Vite to transform the import tree. Before the change, the workers would just hang and
wait when the main process transforms the same modules again and again. Once we merged the projects, the transformation time
dropped significantly. Now the workers do not wait, they run more tests, which causes CPU saturation and system pressure in
general. This effectively results in slower worker performance. But since the actual test run takes only a fraction of the
overall test execution process, the degradation is negligible.  
That being said, combining all standard projects into a single instance made an outstanding impact on the performance and
[confirmed my assumption](https://github.com/vitest-dev/vitest/discussions/10572). The most important thing is that we can
now continue with migration\!

### Act 5 \- Closer to the goal

The next 60 pull-requests were just mechanical. The AI agent has built up the comprehensive skill context. My job was to
check the bad-looking and non-trivial changes. Then also hear the feedback from the reviewers, since I can not in this world
know each and every unit-test in the Miro application.  
One nice cherry on top was the fact that with the Jest → Vitest migration, we started noticing some test fixtures that had
accidentally leaked into our production bundle (remember point 8?). The logical question would be: how? How did we detect
this, and how did the test data leak into the production bundle?

The first part was easy for us \- we build the web application with Rspack with no overrides or patches in the config to
support Node.js modules. In fact, Vitest uses the NodeJS api under the hood (it is a Node library in the end). As a result,
Rspack would fail to build the application once any part of Vitest is imported in the dependency graph.  
How does it usually happen for us?

1. Barrel files. Every package in the repository exports its API via the barrel file `index.ts`. Although it would work fine
   in small projects, barrel files give nothing but pain as the application gets bigger. Barrel files, and especially star
   exports (`export * from ‘./foo.ts’`) are hard to tree-shake, and you never know what exactly is being exported.
   Accidentally, some test shapes were exported transitively as well.
2. Some teams actually used test helpers to create artificial users and accounts in the production code. These were edge
   cases, but still happened.

The Vitest migration clearly highlighted such cases and made us improve the codebase. This gave us approximately a 4MB cut
from the full production build.

### Act 6 \- One-shotting the web core

We had migrated all packages at that point, and the AI agents now had a definitive playbook on how to run the migration. Now
it was time for the final boss: the web core monolith. 1,800 test files, 16,500 tests. I realized it was too risky to run the
migration during business hours \- engineers merge pull-requests once every 10 minutes. I would spend more time resolving the
conflicts. I decided to handle it during the weekend (no worries, I took two days off to compensate\!)  
On Saturday, I told the AI agent to run the migration. The result: 1,985 files changed, \+22,776 / \-19,998 lines diff. This
pull-request tagged each and every team for review, but my plan was to merge it right away with an admin override approval.
It wasn’t perfect, but it was decent enough. The rest we could fix later with smaller PRs during business hours. It took me
an entire day to look at the changelog\!  
I clicked the `Bypass rules and merge` button and waited for the main branch CI to complete. I could finally go to sleep.
**We made it**.

### Act 7 \- Aftermath breakthrough

I don’t want to give the impression that the transition was perfectly smooth. Once we completed the mechanical work, we had
to clean up the configs, revert the hybrid setup, and start removing Jest dependencies. But this is fine. The bigger problem
(ironically) was that Vitest is a much more reliable tool than Jest. It has its own timeout for module imports, it catches
unhandled errors, it races the duplicated `vi.mock` blocks. All of this actually made a small subset of tests _more_ flaky.
We spent some time stabilising the tests, exploring the actual cause, and working with the owners to see how we could address
it. A fractional chunk of tests (think of 27 test cases) was completely skipped for the sake of CI stability.

But one question still stood out in my mind \- we were able to speed up the run and save memory by merging the projects.
Could we merge **everything** into a single Vitest project?  
One of the advantages of the transition to Vitest is that we were able to drop tons of legacy configurations. This made all
custom Vitest configs look like this:

```js
import { defineProject, mergeConfig } from 'vitest/config';
import defaultCfg from '@shared/config/vitest/shared.config.js';

export default mergeConfig(
	defaultCfg,
	defineProject({
		test: {
			setupFiles: ['./setupVitest.ts']
		}
	})
);
```

Only the setup script is what makes us create the custom configs. Why does that matter? If the setup file is the only
difference, maybe I can detect which test file is running and call the setup script relative to that file\!  
There is no documentation around it. The only hint I got is [this page](https://vitest.dev/api/expect.html#expect), which
explains the interface for the `expect` api. Apparently, `expect.getState: () => MatcherState`, and then `MatcherState` has
the field `testPath` \- the absolute test path, which is **exactly what we are looking for**.  
Now I quickly spun up the shared setup script, which takes the test path, derives the package the test is located in. and
then dynamically executes the setup script attached to that specific test file. Here is the idea:

```js
import { existsSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { expect } from 'vitest';

const repoRootDir = '%repo_root_path%';

const absoluteTestPath = expect.getState().testPath;
const relativeTestPath = absoluteTestPath ? relative(REPO_ROOT_DIR, absoluteTestPath) : '';

const vitestProjectRootDir = fetchProjectDirForTestFile(relativeTestPath); // you can manupulate the path to find the right location

const setupFile = vitestProjectRootDir ? resolve(repoRootDir, vitestProjectRootDir, 'setupVitest.ts') : '';

if (setupFile && existsSync(setupFile)) {
	await import(setupFile);
}
```

You can make this script project-agnostic and execute it for each test file. Doing this, we were able to merge ALL 800+
Vitest projects in our application into a single test run. No transformation overhead, no cache duplications. To give you an
idea of how impactful it was, I will give you a sample:

| Metric             | Before        | After       | Delta          | % Change |
| :----------------- | :------------ | :---------- | :------------- | :------- |
| **Heap Memory**    | 5,238 MB      | 1,857 MB    | \-3,381 MB     | \-65%    |
| **Total Memory**   | 22,460 MB     | 17,450 MB   | \-5,010 MB     | \-22.3%  |
| **Total Duration** | 865.64s       | 588.82s     | \-276,82s      | \-32%    |
| **Test speed**     | 12.6 test/sec | 19 test/sec | \+6.4 test/sec | \+50%    |

Finally, we found the source of the speed ✨ And this concluded our road to landing Vitest in our main Frontend application.

## Results

| Active migration time | About 80 days (May 4 to July 20\) |
| :-------------------- | :-------------------------------- |
| Merged pull requests  | 97                                |
| Lines added/removed   | \+87,701 / \-78,946               |
| Net lines             | \+8,755                           |
| Files touched         | 9,328                             |

Notice we have added almost 9,000 net lines of code. The actual net is much lower, because we moved from globally injected
api (think `jest`, `it`, `describe`, etc.) to locally imported objects (`import {describe} from ‘vitest’`). Plus, code
formatting gave some diff. Now to the technical details:

- The test runs are 50% faster than they were with Jest (13 test/sec to 19 test/sec)
- Vitest consumes 30% less memory on the CI runners
- Vitest mocks are type-safe i.e. they inherit the signature from the mocked object, allowing engineers to write better
  unit-tests.
- ESM-first. The mocks are hoisted automatically, which gives again the better experience for the engineers.
- Production bundle saved around 4MB, the test fixtures were pulled out from the production barrel files
- Real test isolation \- each test file is being run on an isolated worker in the pool, ensuring tests do not interfere with
  each other
- Accurate test coverage. [allowExternal: true](https://vitest.dev/config/coverage.html#coverage-allowexternal) allows us to
  collect the test coverage, dropping the project boundary. We collect the full picture.
- We collected the test polyfills from all files, generalised them, and stored them in a shared configuration. Not only did
  it simplify the tests, but we also made sure engineers have a consistent experience with the polyfilled api’s
- The migration AI skill was transformed into the unit-tests creation skill. Now it gives the agents the common patterns from
  our codebase, which enabled better test generation

The total model usage during this period cost around \$7,000. To put this into perspective, I estimated the annual savings
from the migration on CI runners at approximately \$75,000. We should also account for more application releases: as I
mentioned at the beginning, we started facing more and more memory issues for Jest runs. Add here the faster feedback loop
during the local development as well, which is, to be fair, hard to estimate. All of this made the investments a huge win for
us.

## Lessons learned

In 2026 here at Miro, we keep experimenting with large-scale migrations. Our goal is to provide engineers with the
best-in-class tooling and infrastructure. We have already made a transition from Prettier to Oxfmt, from ESLint to Oxlint,
from Webpack to Rspack. It was just about time to switch from Jest to Vitest. Each journey results in lots of artifacts for
future improvements. And lessons learned along the way. Here are some of them:

1. **Set a clear goal**. Be specific about what you want to accomplish. Research the market and find the tools that can move
   you towards the goal. Experiment with a subset of the codebase to be able to estimate the scale and feasibility, and to
   get a feel for the planned work.
2. **Plan the execution**. Sometimes you just need to make a big bang migration. Sometimes you can be more gentle and have a
   gradual rollout. For Vitest, I made a safe bet to iterate and build up the context for the AI agents. It worked pretty
   well, and at some point we were able to one-shot the remaining tests.
3. **Be specific in the prompts with AI agents**. Give a deterministic way to reproduce the result. Set the constraints. It
   was not possible to run the subagents in parallel because Vitest takes so much memory in our case. I asked to run the
   migration sequentially, so it did not ruin my workstation.
4. **Build trust**. People resist change. My goal was to give the reasoning behind the change, acknowledge the struggle to
   understand where to use which runner, and help to adopt the new tooling.
5. **You can not plan for everything**. There are always issues you could not possibly expect during the preparation. You
   need to accept it and not be afraid to pivot and look up for the solution.
6. **The scale of change does not matter at this moment**. With Fable 5, or Sol, AI can execute any volume of change. If you
   can formalise what needs to be done, if you can create a context for the agent, if you can give a deterministic
   reproduction \- the implementation part is extremely democratised.
7. **Trust the CI**. Some changes during the migration were trivial. Others touched the production logic. I worked with the
   code owners to understand if the change I am introducing is legit. But at the end of the day, you have to build the
   release quality gates that are trustworthy, and a rollback process so fast, so even if you end up having a bad day, you
   can easily fix the mistake.

## To wrap it up

We have completed the migration of our main frontend application from Jest to Vitest. The transition took 70,000 tests to
transform (75,000 as of the last merged pull-request date). It took us just a bit over 2 months to execute. We used Opus 4.8
and Fable 5 (once it was released) to drive the migration.  
Migration to Vitest gave us space and resources to grow further, modernised our codebase, and allowed us to start writing
type-safe unit-tests. It also caught the test data leaks into the production bundle and actual production bugs.  
This project paid off in all areas we were targeting. It also built a story of how useful the AI agents can be if done right.

Special credits go to [Evgeny](https://www.linkedin.com/in/evgeny-evsyukhin), who has heavily contributed to the migration as
well as the observability infrastructure around Vitest. I want to also mention
[Ivan](https://www.linkedin.com/in/ivan-voronin), [Ahmed](https://www.linkedin.com/in/ahmedelgabri),
[Frederico](https://www.linkedin.com/in/fredericoestrela), [Vini](https://www.linkedin.com/in/viniciuskneves/), and my
beloved Frontend Developer Experience team for making the migration possible. I also want to give a shoutout to
[Ben](https://www.linkedin.com/in/ben-makuh) for proofreading and helping me refine this article

PS: Since we created this Jest to Vitest migration skill, I thought it would be nice to create an open-source version as
well. It can be a good foundation for your own contextual migration skill.
[Feel free to use and contribute here](https://github.com/n0th1ng-else/agent-skills#jest-to-vitest-migration-skill)
