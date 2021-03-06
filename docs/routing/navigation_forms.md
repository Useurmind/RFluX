# Forms of navigation

There are two forms of navigation in rfluxx:

- link based navigation
- communication based navigation

They differ greatly and should be used in the correct cirumstances.

## Link based navigation

Link based navigation is the simpler form of navigation in rfluxx. You put a link component in a page and when the user clicks it the app will navigate to the url stated in the link. It works the same as common link based navigation but it keeps the user in the app.

__Example:__
Here we render a welcome page that has a link pointing to a tutorial page.

```typescript
    import { RouterLink } from "rfluxx-routing";

    export class WelcomePage : Component<...>
    {
        public render(): any 
        {
            <div>
                <span>
                    Welcome to our nice site!
                    Below you can find a tutorial on how to use it.
                </span>
                <RouterLink caption="Tutorial" path="/tutorial" />
            </div>
        }
    }
```

When you click on the link the url will be changed to `<baseUrl>/tutorial`. If a site map node was defined for that url fragment it will be opened. The user can still navigate back as he is used to as rfluxx uses the history of the browser to perform navigation.

### Dynamic linking

Sometimes you want to create your links dynamically e.g. in a store and navigate on button presses from an action.

For these cases you

## Communication based navigation

In some cases you need more than just redirecting to another page by way of a link. Sometimes you want to transmit additional information to another page that does not very well fit into a url. And in some cases you even want to get information back from the page once the user has finished it. 

There are ways to do this with urls. But the urls would get very long. And most browsers do not support arbitrary long urls. Keeping a lot of the state of a page in a url is basically no good idea.

Rfluxx provides you with the possibility to do page communication. From a store you can call onto another page, give it some input and retrieve the output when the other page has finished. 

### Pages as units of work

We assume the pages requested through page communication to be units of work. This means page communication is not meant to transmit information back and forth. It should rather be used like backend calls.

__Example__: A page wants certain inputs that another page can ask from the user. The page calls onto the other page, the user inputs everything there and the response is given back to the initial page.

### Using page communication

In a store on your requesting page you should inject the `IPageStore` which is an interface that allows you to interact with the central services from inside your page. On this interface you can then call `requestPageWithResult` to request another page.

`RequestingStore.ts`
```typescript
export interface IRequestingStoreOptions
{
    // depend on the page store and inject it
    pageStore: IPageStore;
}

export class RequestingStore extends Store<...>
{
    //...

    private onRequestOtherPage()
    {
        // the interface comes from the requested page
        const inputData: IRequestedPageInput = // ... build some input data

        // request the other page who is located at <baseUrl>/requestedPage
        this.options.pageStore.requestPageWithResult("/requestedPage", inputData)
            .subscribe(result => {
                
                // the interface comes from the requested page
                const otherPagesResult: IRequestedPageOutput = result.pageResult;

                // ... update your state with the result from the other page
            })
    }
}
```

In the store on the requested page you can use the page request object by injecting it alongside your page store. When the user is finished and wants to commit his input you can respond to the other page. This will close the requested page.

`RequestedStore.ts`
```typescript

export interface IRequestedPageInput 
{
    // fields for input data
    someField: string;
}

export interface IRequestedPageOutput 
{
    // fields for result data
    // ...
}

export interface IRequestedStoreOptions
{
    // depend on the page store and inject it
    pageStore: IPageStore;
}

// we specify an interface for the store that holds all its actions
// IRequestedPageStore specifies an action to receive the page request
export interface IRequestedStore extends IRequestedPageStore
{

}

export class RequestedStore extends Store<...> implements IRequestedStore
{
    // this action is defined in IRequestedPageStore
    // it will automatically be called on the store after creation
    public readonly setPageRequest: IAction<IPageRequest>;

    //...
    constructor(private options: IRequestedStoreOptions)
    {
        super({
            initialState: {
                // this should come from the page request
                someField: null 
                // ...              
            }
        });
        
        // subscribe this action defined via IRequestedPageStore to receive the page request object
        this.setPageRequest = this.createActionAndSubscribe<IPageRequest>(pageRequest => {
            var input = pageRequest.data as IRequestedPageInput;
            this.setState({
                ...this.state,
                someField: input.someField
            });
        });

        // more actions
        // ...
    }

    private onUserCommit()
    {
        const resultData: IRequestedPageOutput = // ... build some result data object

        // give the result data back to the previous page and close this page
        this.options.pageStore.complete.trigger(resultData);
    }
}
```