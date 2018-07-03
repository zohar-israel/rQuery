# rQuery.js 

A State Orchestration Bridge for react, inspired by jQuery.
Bridges the gap between siblings, decedent and ancestor components.



![](https://raw.githubusercontent.com/zohar-israel/rQuery/master/demo/public/readme.jpg)  

 Wouldn`t it be awesome to just write:  
 
```
R$("<jQuery style selector>").setState({key: value})
```    

and  

```
R$("<jQuery style selector>").forEachDOMNode(elm => elm.style.backgroundColor = "gold")
```    


Anywhere!

------------


## Demo
If you rather read code than English, there's a live, editable demo is available at 
<a href="https://codesandbox.io/s/o5kn706vzz">
  CodeSandbox
</a>


[![Edit rQuery](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/o5kn706vzz)


## Usage



#### Install  

Download rquery.js and add it to your project.

#### Import  

To use rQuery import it by adding the following line to the top of the file, make sure that path points to the location of rquery.js

```
import R$ from "./rquery.js";
```
#### Set the state and invoke component functions  

Access the state of a Component using jQuery style syntax and invoke the React Component methods, by using the following code.

```
// to set the state
R$("<jQuery style selector>").setState({key: value})

// or to call other React Component methods
R$("<jQuery style selector>").anyReactComponentMethod()

// or to invoke a user defined function in the Component
R$("<jQuery style selector>").anyFunctionInTheComponent()
```
This can be placed within other components, in a user triggered function, in a timer, anywhere.

The invoked react methods are executed in the context of the matched components, so you can access the state via setState(), the DOM element, and any function defined in the Component.
#### Access the Component state values and public properties

rQuery also supports using states of external Components in Props
```
<span style={{ color: R$("<otherComponentSelector>").state.color }}>
```
### Registering a Component with rQuery

For performance optimization, rQuery does not register all the React Components in its internal registry by default, Components that are to be accessed from the exterior should be marked as such.  

#### Registering by inheriting React.$Component  

The simplest way to mark a Component as accessible to rQuery is to inherit it from React.$Component, instead of React.Component.  
The React.$Component simply inherits the original React.Components and overrides the ```componentWillMount``` and ```componentWillUnmount``` methods to handle the registration of the Component with rQuery.  
```
class Comp extends React.$Component { 
```
If you implement the ```componentWillMount``` and ```componentWillUnmount``` in your Component, add a call to super at the top of your functions.
```
  componentWillMount() {
    super.componentWillMount();
	....
  }
  componentWillUnmount() {
    super.componentWillUnmount();
	...
  }
```  

#### Registering from the  ```componentWillMount``` and ```componentWillUnmount``` functions.
Alternatively, you can register a React Component that extends React.Component directly by registering and unregistering it in the  ```componentWillMount``` and ```componentWillUnmount``` functions.  

```
  componentWillMount() {
    R$.registerComponent(this)
  }
  componentWillUnmount() {
    R$.unregisterComponent(this)
  }
```
Using this method you can also pass a second variable to R$.registerComponent
```
  componentWillMount() {
    R$.registerComponent(this,additionalSelector)
  }
```
That variable will serve as an additional way to select that component.
## Selectors

rQuery returns an array of React Components matched by jQuery styled selector syntax.  
Assuming the following React Component:
```
<MyComponent id="ComponentID" attribute="value" className="className"/>
```
We can select it using any of the following selectors:  

##### Component type  
```
R$("MyComponent").setState({key: value}) // or any other method
```  

##### Component ID  

```
R$("#ComponentID")...
```  

##### Attribute values  

```
R$('[attribute="value"]')...
```  

##### Classes  

```
R$('.className')...
```  

##### Multiple selectors  

rQuery supports multiple selectors and always returns a unique array of Components even if a component was matched more than once
```
R$("#ComponentID,.className")...
```  

## Methods
The array of the React Components that matched the selector is enhances with a number of utility methods, which internally iterate over the results and invokes the corresponding function on each of the element.
Those are shorthands to keep your code readable and are equivalent to using:  

```
R$("App").forEach(e => e.<method to call>);
```

### React methods  

The returned array exposes the React Component methods, and just like in jQuery they are executed on every item in the matched array  

##### setState  

```
R$("App").setState({ title: "rQuery ... from anywhere" });
```

##### forceUpdate  

```
R$("App").forceUpdate(); 
```  

### Additional methods  

##### forEachDOMNode  

Which can be used to alter the underlying dom node corrisponding to each of the matched React Components  

```
R$("selector").forEachDOMNode(elm => elm.style.backgroundColor = "gold") 
```  

### Shorthand properties  

##### state  

Returns the state of the first matched React Component, useful when targeting a single element   

```
R$("selector").state
```  

##### first  

Returns the the first matched React Component, useful when targeting a single element  

```
R$("selector").first
```   

This is useful when the selector targets a single element and can be used in props as:  

```
<span style={{ color: R$("<otherComponentSelector>").state.color }}>
```  

### Component custom functions  

rQuery allows calling user defined functions within the mached components.
Assuming a component Comp  

```
class Comp extends React.$Component {
  customMethod(){
    this.setState({ color: "pink" });
	...
  }
```  

You can invoke the internal customMethod:  

``` 
// of every match
R$('Comp').forEach(c=>c.customMethod())
// or of a single match
R$('Comp').first.customMethod()
 ```  
 
### Chaining

Again in the jQuery spirit, chaining of methods is supported.

```  

R$("Notification")  
	.setState({ read: true })
	.forEachDOMNode(elm => elm.style.backgroundColor = "grey")
	.foreceUpdae()
```    
	
## Dependencies

* [react](https://www.npmjs.com/package/react "react")
* [react-dom](https://www.npmjs.com/package/react-dom "react-dom")
* [react-scripts](https://www.npmjs.com/package/react-scripts "react-scripts")



## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/zohar-israel/rQuery/blob/master/LICENSE) file for details  



