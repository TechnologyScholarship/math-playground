# Prototyping Documentation

## Plan
Mr. Gibson is a (Digitech and) mathematics teacher at Cashmere High School. They would like a tool to help teach student’s understanding of algebra, including the rearrangement and solving of systems of equations. Ideally, such teaching could be done in an intuitive and fun visual manner. Such a tool should ideally be accessible to all students and teachers alike. 

## Specs
- Intuitive interface to aid student understanding e.g. draggable equation operations, clean animations to show what is happening such as how operations always occur on both sides
- Visually appealing to maintain student interest

## Solution
I intend to create a web application with an intuitive, drag-and-drop based UI (similar to scratch.mit.edu) allowing students to play with operating on mathematical equations and expressions, allowing them to gain understanding and find solutions to different algebraic equations. A web application has the benefit that it is easily accessible from any device with an internet connection, or even without, using PWAs.

## Technologies
### Server Backends
| Technology               |         Pros                      |                          Cons     |
|--------------------------|-----------------------------------|-----------------------------------|
| ASP.NET                  | Reasonably scalable               | Made by Microsoft                 |
|                          |-----------------------------------|-----------------------------------|
|                          | Type safe                         | C#, which is made by Microsoft    |
|                          |-----------------------------------|-----------------------------------|
|                          | Easy-to-use routers               | Doesn’t have support for the more |
|                          |                                   | modern JS frameworks              |
|--------------------------|-----------------------------------|-----------------------------------|
| Flask                    | Easy routers                      | Its python (ew) i.e. not very     |
| (/ other python servers) |                                   | fast or scalable                  |
|                          |-----------------------------------|-----------------------------------|
|                          | Fast to develop                   | Again, very little support for    |
|                          |                                   | modern js frameworks (react)      |
|                          |-----------------------------------|-----------------------------------|
|                          | Very janky SSR/templating         | Code duplication between client/  |
|                          |                                   | server as cant do python in web   |
|--------------------------|-----------------------------------|-----------------------------------|
| Next.js                  | Suitable integration for modern   | Js, so may be slower              |
|                          | web frameworks e.g. react         |                                   |
|                          |-----------------------------------|-----------------------------------|
|                          | Easy routers, with support for    | Supported by cloudflare for free  |
|                          | passing information to react      | hosting                           |
|                          |-----------------------------------|                                   |
|                          | Server-Side Rendering, beneficial |                                   |
|                          | for client performance            |                                   |
|                          |-----------------------------------|                                   |
|                          | Type safe using typescript        |                                   |
|                          |-----------------------------------|                                   |
|                          | Using same language on client/    |                                   |
|                          | server allows for some code       |                                   |
|                          | deduplication in shared code      |                                   |
|--------------------------|-----------------------------------|-----------------------------------|
| NodeJS http.server       | Low-level                         | Slow development                  |
|                          |-----------------------------------|-----------------------------------|
|                          | Powerful for any needed low-level | Manual routing and handling       |
|                          | packet management                 |                                   |
|                          |                                   |-----------------------------------|
|                          |                                   | Code duplication                  |
|                          |                                   |-----------------------------------|
|                          |                                   | Hard to scale                     |
|--------------------------|-----------------------------------|-----------------------------------|
