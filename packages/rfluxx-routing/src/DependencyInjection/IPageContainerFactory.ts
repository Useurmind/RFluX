import { IContainer, IContainerBuilder, registerStore, registerTimeTraveler, SimpleContainerBuilder, TimeTraveler } from "rfluxx";

import { IPageCommunicationStore, IPageRequest } from "../PageCommunication";
import { IPageManagementStore } from "../PageManagementStore";
import { PageStore } from "../PageStore";
import { IRouterStore } from "../RouterStore";
import { ISiteMapStore } from "../SiteMap/SiteMapStore";

import { IGlobalComponents } from "./IGlobalComponents";

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
     * - IPageStore: The store that can be used by the page to get easy access to central services.
     * - IPageRequest: The request that lead to the page opening, optional can be null|undefined.
     * - PageUrl: The url (of type URL) that was called for the page to open.
     * @param pageId The page id uniquely identifies the page for which the container is created (computed from the url)
     * @param url The url of the page for which the container is created.
     * @param routeParamters The parameters that were extracted from the route.
     * @param globalComponents The global stores provided by the framework.
     * @param pageRequest The request that leads to the page. Can be null for pages to which was just navigated.
     * @returns The new container.
     */
    createContainer(
        pageId: string,
        url: URL,
        routeParameters: Map<string, string>,
        globalComponents: IGlobalComponents,
        pageRequest?: IPageRequest)
        : IContainer;
}
