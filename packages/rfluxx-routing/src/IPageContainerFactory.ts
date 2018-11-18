import { IContainer, SimpleContainer } from "rfluxx";

import { IPageCommunicationStore, IPageRequest } from "./PageCommunicationStore";
import { IPageManagementStore } from "./PageManagementStore";
import { IRouterStore } from "./RouterStore";
import { ISiteMapStore } from "./SiteMapStore";

/**
 * Data object to hold the stores that are globally unique in the
 * routing library.
 */
export interface IGlobalStores
{
    /**
     * The router store that watches the window location for changes.
     */
    routerStore: IRouterStore;

    /**
     * The site map store that determines the current site map node.
     */
    siteMapStore: ISiteMapStore;

    /**
     * The page management store that manages the state for the active pages.
     */
    pageManagementStore: IPageManagementStore;

    /**
     * The store that allows for communication between pages.
     */
    pageCommunicationStore: IPageCommunicationStore;
}

/**
 * The container factory is used to create a container for a page.
 * You need to provide an implementation for this so that the { @see PageManagementStore}
 * can create a new container for each new page it hits.
 */
export interface IPageContainerFactory
{
    /**
     * Create a new container.
     * The container should contain the following registrations:
     * - IRouterStore
     * - ISiteMapStore
     * - IPageManagementStore
     * - IPageCommunicationStore
     * - IPageRequest: The request that lead to the page opening, optional can be null|undefined.
     * - PageUrl: The url (of type URL) that was called for the page to open.
     * @param url The url of the page for which the container is created.
     * @param routeParamters The parameters that were extracted from the route.
     * @param globalStores The global stores provided by the framework.
     * @param pageRequest The request that leads to the page. Can be null for pages to which was just navigated.
     * @returns The new container.
     */
    createContainer(
        url: URL,
        routeParameters: Map<string, string>,
        globalStores: IGlobalStores,
        pageRequest?: IPageRequest)
        : IContainer;
}

/**
 * A base class for a page factory that already includes functionality like
 * - registering global stores (IRouterStore, ISiteMapStore, IPageManagementStore)
 *
 * Uses { @see SimpleContainer } for dependency injection and resolution.
 */
export abstract class SimplePageContainerFactoryBase implements IPageContainerFactory {

    /**
     * @inheritDoc
     */
    public createContainer(
        url: URL,
        routeParameters: Map<string, string>,
        globalStores: IGlobalStores,
        pageRequest?: IPageRequest)
        : IContainer
    {
        const container = new SimpleContainer();

        container.register("IRouterStore", c => globalStores.routerStore);
        container.register("ISiteMapStore", c => globalStores.siteMapStore);
        container.register("IPageManagementStore", c => globalStores.pageManagementStore);
        container.register("IPageCommunicationStore", c => globalStores.pageCommunicationStore);

        container.register("IPageRequest", c => pageRequest);
        container.register("PageUrl", c => url);

        this.registerStores(container, url, routeParameters);

        return container;
    }

    /**
     * Implement this method to register your own stores.
     * @param container The container in which you can register your stores.
     * @param url The url of the page for which the container is created.
     * @param routeParamters The parameters that were extracted from the route.
     */
    protected abstract registerStores(container: SimpleContainer, url: URL, routeParameters: Map<string, string>);
}