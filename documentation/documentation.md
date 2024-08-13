# Prototyping Documentation

## Plan

Mr. Gibson is a (Digitech and) mathematics teacher at Cashmere High School. They would like a tool to help teach student’s understanding of algebra, including the rearrangement and solving of systems of equations. Ideally, such teaching could be done in an intuitive and fun visual manner. Such a tool should ideally be accessible to all students and teachers alike. The target audience is students and teachers alike.

## Specs

- Design a web application with a drag-and-drop based UI, similar to Scratch, to allow students to experiment with mathematical equations and expressions
- Create a visually appealing design (e.g. with animations) that maintains student interest and engagement
- Develop an intuitive interface that aids student understanding of algebra
- Draggable equation operations to facilitate interactive learning
- Should enable students to find solutions to different algebraic equations in a fun and interactive way


## Solution

I intend to create a web application with an intuitive, drag-and-drop based UI (similar to <https://scratch.mit.edu>) allowing students to play with operating on mathematical equations and expressions, allowing them to gain understanding and find solutions to different algebraic equations. A web application has the benefit that it is easily accessible from any device with an internet connection, or even without, using PWAs.

## Technologies

### Server Backends

- ASP.NET
  - Pros:
    - Reasonably scalable, allowing for cost- and time-effective expansion in future, at the stakeholder's will.
    - Type safe, decreasing the possibility for bugs to escape into production, eventuating a better user experience (avoiding unexpected errors or "down for maintanence"). Also more cost-effective by reducing maintanence cost.
    - Easy-to-use routers, allowing for a fast development cycle and iteration process, so the application can be production-ready as fast as the stakeholder requires.
  - Cons:
    - C#  and .NET are made by Microsoft, subject to their development ideologies, which are quite old (not modern-day industry standard) and "feels weird" - decreased developer experience working with older models like MVC (model-view-controller) which also require large amounts of bootstrap code, increasing time-to-prod.
    - Doesn’t have great support for the more modern frameworks, such as React, decreasing interopability between server and client code, increasing development time (code duplication) and increasing the potential for bugs.
- Flask (/ other python servers)
  - Pros:
    - Extremely easy routers allowing for extremely fast development iterations, meaning the stakeholder can expect to see feedback implemented extremely quickly.
  - Cons:
    - Python is not very performant or scalable, with some, but not very good, support for multithreading etc. which would be required to allow the server to handle heavier traffic. Not neccesarily immediately relevant, but would mean that future expansion of the product market would require a rewrite.
    - Again, very little support/interopability with modern js frameworks (e.g. react), increasing development time due to code duplication across sides, and increasing the chances of bugs between the two (e.g. parser differentials if the client/server handle a request differently).
    - Only supports very janky templating, making dynamic content injection into sites risky (security-wise, possible vulnerabilities allowing users to inject malicious code to run on server/other clients).
- Next.js
  - Pros:
    - Suitable integration for modern web frameworks e.g. react, allowing for suitable integration between client and server, reducing potential for bugs and increasing development speed.
    - Easy routers, with excellent support for passing dynamic information from the server to the client, allowing for strong and safe integration between client and server data.
    - Server-Side Rendering, decreasing the FPT - the time till first "paint", when the user *sees* something. Decreasing the time the user has to wait till they see *something* on the site is good for the user experience and can drastically affect how many users leave your site before it loads, due to it "being slow".
    - Supported by Cloudflare (Worker + Pages), allowing for free hosting initially, including DDoS protection, as well as the option for scaling up easily with Cloudflare's paid plans, for possible future expansion.
    - Type safe using typescript, enforcing safer code for less bugs which could break into production, and compile-time type checking allowing for faster development.
    - Using same language on client/server allows for less code duplication in shared code, increasing development speed.
  - Cons:
    - JavaScript is a JIT-ed language, thus isn't nessecarily known for being performant. Performance could become an issue if there is high traffic hitting the server. If needed, this could be mitigated by caching content to send to clients, and spreading the workload across multiple workers, or potentially moving the server to a more performant language (e.g. Rust) further down the line.
- NodeJS http.server
  - Pros:
    - Low-level interaction with packets, alowing for high levels of customisation and much more flexible capabilities on the server. This also allows more opportunity for optimising code.
  - Cons:
    - Manual routing and handling due to the lack of any  higher-level routers etc. to handle processing. This would greatly extend the development time as a lot of development focus would need to be spent on this low-level packet management rather than on the actual product. This would also lead to more code duplication, which would end up being harder to maintain into the future.
    - Hard to scale, in case high traffic becomes an issue, scaling would have to be handled completely manually, creating more opportunity for bugs and more time/cost to develop.
 
Overall, I will use Next.js because it is supported by Cloudflare, allowing for free hosting, protection protection from DDoSes and other common vulnerabilities for free. NextJS and Cloudflare are both incredibly scalable for any future expansion or big traffic. It also has suitible integration with frontend technologies which can make development easier and faster, so that the product would be released sooner for my stakeholders.

### Frontend frameworks

- Svelte
  - Pros
    - Uses a component-based system, prefering abstraction for lessened code duplication, again decreasing development time.
    - Is a relatively simple solution, with  its simplicity often keeping relatively clean code and easy to maintain, again decreasing development time.
  - Cons
    - Uses some unusual patterns and syntax, which would take longer to get accustomed to, increasing development time. (Additionally, it's just opinion but I dislike the patterns as it is often unclear exactly *how* Svelte is handling what you give it, and can lead to some unexpected outcomes).
    - Relatively new, thus has a small community, so less documentation, support, and IDE integration.
    - Not as scalable as other solutions, such as React, due to  it's simplistic nature. This is intially alright, and even leads to  faster development, but later down the line this could become an issue as Svelte may not support some features we require.
- React
  - Pros
    - Relies heavily on components, promoting abstraction to lessen duplicated code, improving development speed.
    - Has wide support and integration for many other libraries and frameworks in the JavaScript ecosystem, decreasing the time cost should any additional functionality/features want added through the use of a library, making expansibility and maintainability increadibly flexible, even if the stakeholders' requirements change drastically.
    - Internally uses complex procedures (hydration) to ensure minimal re-rendering, only updating components when neccesary, improving performance, and leading to a better user experience.
    - Supports "Server Components", rendering an initial version of the site on the server-side as HTML, allowing for a faster first paint (visual page load) on the client, benefiting the user experience (studies show that time to first contentful paint can drastically effect user experience, see <https://web.dev/articles/fcp>). The React library then takes over rendering on the client for responsive rendering (as opposed to continually rendering on server, as some other frameworks do, which is slow).
  - Cons
    - Compiles to web code, which could hinder future expansions to other platforms (native, mobile, etc.) compared to other solutions.
- React + React Native Web
  - Pros
    - Extends React, benefits from the same component-based patterns and server side rendering, etc.
    - Compiles natively to Android and iOS, allowing for mobile support using shared code, allowing for very easy future expansion, for very little added time/cost.
  - Cons
    - Less flexible, as native does not support all the same UI components as web.
- Vanilla (HTML, CSS, JS)
  - Pros
    - Small code size, for faster load times increasing user experience.
    - Static serving, allowing for free hosting on simple hosts like Github or Cloudflare pages.
  - Cons
    - No dynamic content outside of hosting seperate API endpoints
    - Much code duplication, as HTML has no support for templating at compile time (runtime solutions exist, such as HTML &lt;template&gt; element, but has performance degradations).
    - Incredibly unscalable when it comes to large projects, due to the lack of templating or imports for splitting HTML across files or reusing segments. Slows development, and heavily hinders maintainability opf the project, making future extensions increadibly inefficient and costly.
    - Browser support varies for many web technologies, including a lot of CSS features needing prefixing to  work on all browsers, which must be done manually in vanilla CSS, whereas most frameworks automatically compile to all nessecary prefixes.
    - Little/no support for third-party libraries outside of fully switching to some kind of bundler (at which point you might as well use a framework).

Overrall, I recommend React Native Web for clean, organised, flexible and extensible codebase, as well as leaving support for future expansion (e.g. to PWAs or Mobile apps (using Expo)) in case that should ever be needed. The build process can fully integrate with Next.js and expo to make deployment directly to cloudflare increadibly quick and efficient, so that the stakeholder can expect to see results to hotfix patches in good time (e.g. in the case of severe bug-fixes or expoit patches).

### Frontend UI Frameworks

- None (Custom built)
  - Pros
    - Less dependencies, decreasing project bundle size, which can affect hosting prices e.g. with Cloudflare, as well as load time, affecting the user experience.
  - Cons
    - Requires custom-built UI elements, increasing development time
    - More likely to contain bugs, as the code will not have been as extensively tested
    - Code may need to be written for each platform independently (no cross-platform guarantees for all features: see <https://caniuse.com/>)
- Tamagui
  - Pros
    - Fully type safe with typescript support, also allowing for effective IDE integration, making development very fluid and increasing development speed.
    - Offers many shorthands so more fluent developers get a faster development experience, increasing development speed.
    - Naturally targets both mobile and web, allowing for easy expansibility to native and mobile in case of future expansion.
    - Has many prebuilt GUI components such as dialogs, buttons and menus, SVG icons, as well as theming support
    - Comes with great support for animations, offering three animation drivers to support all platforms, allowing for quick development (less development time) of fluent animations, benefitting user experience.
    - Compiles to CSS for maximal performance on web, improving user experience.
    - Very frequent updates and bug-fixes, improving developer experience, as bugs experienced are likely to be fixed library-end very quickly.
  - Cons
    - Doesn’t fully support all events cross-platform due to discrepencies between how events are gathered on platforms (e.g. mobile doesn't have mousewheel event, so platform-specific code is needed).
    - Documentation not fully complete, increasing development time.
- Tailwind css
  - Pros
    - Extensive support for CSS styles, allowing for maximal flexability in the capabilities of the UI.
    - IDE support for type-hinting, benefitting developer experience and decreasing development time
    - Well documented and large community, meaning support is readily available, increasing development speed
  - Cons
    - Doesn’t naturally support native/mobile (outside of tailwind-react-native-css), decreasing scalability (likely forcing a complete rewrite for mobile) in case 
    - Hard-to-use, everything in the library is mostly is acronyms that developers must simply remember, which can be intimidating for ne wdevelopers, and would increase the amount of time spent in development.

I recommend to use Tamagui due to it's high level of interopebility with React (Native Web) and Next.js, meaning that development should go reasonably smoothly, and the result should be easily expansible for possible future native/mobile support. Tamagui is also highly extensible and abstractable using styled() to inherit and style components in a polymorphic-like manner. Covers most UI use-cases with cross-platform code, but has extensive support for platform-dependance as well. Compiles to CSS on web, making very performant for web users. Also compiles to native android/ios UI elements when available, increasing interopability with their system’s native UI.

### Math Rendering Framework

- Custom Built
  - Pros:
    - Full control over rendering, allowing for smooth and fluent interopability with other UI elements that we create.
  - Cons:
    - Requires a lot of time to  create a fully extensive solution that covers all our needs.
    - More prone to bugs due to the less extensive testing we can put in over other  solutions, which are primarily made for math rendering and have undergone rigorous testing.
    - We do not have the capacity to test all possible use cases over all browsers, so we might miss out on some bugs due to discrepencies in how browsers handle rendering.
    - Requires our own constant support and maintanence for, as browsers update and change we will have to ensure the math rendering is always up-to-date.
- MathJax
  - Pros
    - Tried and tested solution, would "just work"
    - Well known, so plenty of documentation and community to  provide support, benefiting development speed.
  - Cons
    - Integration with React would not quite be seamless, requiring us to make a custom wrapper, which would take time and be prone to bugs.
    - No support for math input fields, just output rendering, making a suboptimal user experience.
    - In my experience, can be quite unperformant, deminishing user experience.
- MathQuill
  - Pros
    - Well-known and well-tested, (used by Desmos)
    - Open source, so free and we can contribute if any features are missing that we may need
    - Support for input fields as well as static math rendering, allowing for a all-round clean, fluent user experience.
    - Integration with react already supported through [react-mathquill](https://www.npmjs.com/package/react-mathquill) wrapper.
    - Supports embedding custom renderers within the math, which will be aligned properly. Useful (flexible) for embedding our own UI within the math.

## Build

![Application main screen, showing the equation working stack, and the bottom toolbar with mathmatical operations](./images/main.png)
> Please note the expressions shown are for testing and may not  be mathmatically correct (x does not = 14)

I chose to layout the toolbar along the bottom, as here there is the most space, and it also feels intuitive to drag stuff from down there. A horizontal scroller was used in case this should overflow, but this behaviour could also be replaced with wrapping if preferred by the stakeholder (wrapping could, however, become a problem on screens that are small in width *and* height). I experimented with a solution that would wrap up until a certain maximum height, before switching to a horizontal scrollbar, but such a solution was limited by the reduced capabilities of react native web. The rest of the content consists of a *stack*, containing the history of the solving of the equation. I chose to layout the whole history so that the user can at any point look back upon their working to see how they got where they are. The most recent equation is emphasised by highlighting it in a more contrasting color than the others, to subtly indicate where users should focus most. The most recent row also offers an "undo" button to revert the state to the previous row.

![Equation working stack, with a scrollbar when overflowing the page height](./images/scrolling.png)
The "equation stack" is hosted in it's own scrolling container so that the toolbar always sticks to  the bottom, even if the stack overflows the screen height. This container is outlined to provide and indicator of its bounds, which also defines the drop region for the draggable equation elements. Such a visual indicator of the bounds makes the drag-and-drop UI a lot more intuitive. The implementation is quite flexible, so future expansion could see multiple of these regions, having two equation stacks side-by-side, allowing for simultaneous viewing & working on both.

![Animation showing the equation actions being dragged onto the equation](./images/dragging.apng)
I chose to use the drag-and-drop UI because it fit my stakeholder's needs of being intuitive for students to understand and "playful" in a way that would keep younger studdents interested. Additionally, you can see the animations presented upon dropping the action - the equation fluently jumps down from it's previous state. A future extension could see more work into this animation - it would be excessive effort, but transmorphing the text in an almost fluid-like manner could be very cool! Overall, I think the animation is clean enough to make the UI feel fluent, and the drag-and-drop nature really sells the idea that the "actions" in the toolbar are things that you can *totally* just apply whenever you want, so long as you ensure to apply it to both sides (as enforced by the design).

### Build details

#### Rendering math

For some features, it was *ideal* to be able to embed custom content *within* MathQuill's math fields. To do this, I used MathQuill's ability to embed custom "renderers" to create a target to render the embedded fields to, and then in order to maintain interopability with React components, I used React portals, which allowed the React components to remain in the React DOM while simultaneously existing in a different place in the true HTML DOM. This way I could still use React to render and update the embeds, while still rendering them inside of MathQuill elements. This functionality was entirely wrapped up in a custom wrapper component, `<MathQuillText>`, so that all of the complex integration to make this work was hidden behind an abstraction layer, and so that elsewhere in my code, all it took was passing this prop the standard latex input, *and* any HTML embeds directly as children! e.g.

```tsx
(<MathQuillText>
  \sqrt[<MathTermInput>2</MathTermInput>]{'{\\ellipsis}'}
</MathQuillText>)
```

would render the square root, with an ellipsis inside, and would *directly* render the `<MathTermInput>` component in the upper left, *n*-th root position. This is used e.g. in the equation actions in order to render the input fields within the static math. By abstracting this comploex logic into a simple, easy-to-use component, this gave the freedom to focus on higher-level details.

#### The draggable UI

The draggable UI was implemented using an abstract React component which implemented draggable behaviour. Due to the difference between how dragging is implemented natively on mobile and on web, this behaviour doesn't come for free. However, by using an abstract React component, we can implement the underlying behaviour differently for each platform. The `<Draggable>` component can then be used elsewhere throughout the codebase *without* worrying about how it's actually implemented (treating it as a black box that simply does what we want). This means that, while no mobile support is currently available, if it was later required by my stakeholder then it *could* be quite easily achived due to the flexability and extensibility of the application and React Native Web.

#### Equations

Equations are internally expressed in LaTeX, which is what MathQuill directly uses. This means that when we are modifying the expressions, we have to manipulate the LaTeX string. To do this i have used Regular Expressions (regex), as, while regex has no support for the recusive nature of nesting (with paranthesis and {}, etc.), its an increadibly efficient and fast-to-develop option which can "get the job done" in an incredibly time and cost-effective manner. Well designed regex can be much more performant than other string manipulation techniques, as regex is implemented language-level as opposed to running as JavaScript (slow!). (there are definately no large companies who have recently downfallen due to the use of regex). 

#### Equation actions

For equation actions, some extra information is needed with the dragged element, namely, *exactly what should it do when it is dropped on the equation*? I have an equation action component,  which composed of a `<Draggable>` to gain the draggability behaviour, and also carrying a "transformer" function (`(input: string) -> string`) which determines what happens when the action is dropped on an equation, by accepting the current string representation (as LaTeX) and returning the newly modified one. Equation actions also render using the aforementioned `<MathTermInput>` component to embed inputs to customise the action, e.g. setting the expression to be added/multiplied, etc.
