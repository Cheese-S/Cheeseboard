# Cheeseboard

Cheeseboard is a web whiteboard that focuses on performance and efficiency.

Run ``` Yarn Install ``` in the root directory and in example.

Run ``` npm run start ``` in the example directory to see cheeseboard in action.

See [Cheeseboard](https://cheeseboarddemo.web.app/) in action 

MIT © [Cheese-S](https://github.com/Cheese-S)

## Rerendering
 
One of the things that Cheeseboard tried to deal with is state management and re-rendering. Consider a traditional whiteboard app that has some high-level control (stroke width, color, position, etc.) over many elements in the graph. Our goal is to somehow modify these high-level states, alert the corresponding low-level shapes to rerender, and do ***nothing*** to shapes that don't use these high-level states directly.
 
There are two obvious, not perfect, solutions:
- Context
- React.memo
 
### Context
Indeed, you can associate a shape with a context and pass down the value using that particular context. Since only one shape subscribes to that context, each state change only rerenders one shape. However, this becomes no longer feasible when we need to add a new shape. A new context needs to be added at the top of the react tree (because other components might also need access to it). This will trigger a reconstruction of the whole tree. This alone should show you why this is not a good solution.
 
### React.memo
React.memo seems to be designated for this issue. In fact, it is used widely for these components-heavy applications. I admit I am being picky here. But, it should be noted that React.memo will run through a "check" function *** every time *** the wrapped component is being asked to rerender. In addition, when a component simply passes down some props to its child, one would have to write their comparison function to make sure rerendering is only triggered at the correct time. One last disadvantage is that using React.memo sparingly will result in a really, I mean ***really***, ugly react tree. The combination of these disadvantages makes React.memo undesirable.
 
### Recoil
After some time scrambling through countless react state management libraries, I ended up with recoil. Recoil is a library developed by Facebook to solve performance issues related to its own internal whiteboard app. A key concept of recoil is that each component subscribes to a certain atom that carries the state. This atom lives outside of the application so appending or deleting it does not trigger a tree reconstruction. For people who are interested in recoil, please watch this [talk](https://www.youtube.com/watch?v=_ISAA_Jt9kI&t=636s) given by Dave McCabe. It's a much better and more comprehensive explanation of how recoil works than what I wrote here.
 
## Quadtree
 
Firstly, I have to admit that quadtree is probably an overkill for the project. The cost of maintaining a quadtree might outweigh the benefits when the number of shapes is relatively low. However, this allows Cheeseboard to deal with ***a lot of*** shapes effortlessly.
 
To understand why a quadtree is beneficial, we need to understand when we are going to use it. Whenever a user rectangle selects, we need to figure out what shapes actually intersect with the user-defined rectangle. What makes rectangle select potentially expensive is that we have to do intersection tests every time ***onMouseMove*** event gets reported. The rate at which the onMouseMove event gets reported is entirely dependent on the browser. Therefore, to make rectangle selection a smooth experience, we must lower the cost of intersection tests.
 
Again, imagine our app contains hundreds, if not thousands, of shapes. Doing intersection tests on that many shapes will always be costly no matter how fast your underlying algorithms are. So, what we will do is use a quadtree to prune out the problem space. We use a quadtree to find out what shapes are "likely", or close enough, to intersect with the user-defined rectangle.
 
 
## Freehand Drawing
 
Freehand drawing ⁠— a feature that makes a whiteboard whiteboard ⁠— turned out to be the most complicated feature. One major difference between lines and all other shapes is that all geometric operations on lines are bounded by the number of points a line consists of. As mentioned above, the number of points a line might end up with entirely depends on the ***onMouseMove*** event. For the sake of performance, I introduced the following two optimizations.
 
### Prune Unnecessary Points
 
Remove the points that are too close together. Yes, you heard it right. This step alone can deal with the annoying cases when the browser dutifully dispatches multiple onMouseMove events when the user barely moves their mouse.
 
A more interesting algorithm is called Douglas-Peucker. [Wikipedia](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm) has a great gif that demonstrates how the algorithm works. This is used as part of the post-processing step that takes effect after the user finishes drawing a line. It also comes with a parameter that we can adjust to control how much of the original shape we want to retain.
 
### Smoothing
 
Running time is not the only metric when it comes to performance. Our whiteboard also needs to look good. Whenever we prune out points from a line, we are running the risk of roughing a perfectly fine line. The smoothing algorithm got us covered. There definitely are more sophisticated algorithms. But, taking the average of the last *n* (n is an adjustable parameter) works just fine for me. Again, smoothing also runs as part of the post-processing step.