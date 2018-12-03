import { IContainer, SimpleContainer } from "rfluxx";

import { IGlobalStores, IPageContainerFactory, SimplePageContainerFactoryBase } from "../../src/IPageContainerFactory";

import { FormPageStore } from "./FormWithSelectPage/FormPageStore";
import { SelectPageStore } from "./FormWithSelectPage/SelectPageStore";

export class ContainerFactory extends SimplePageContainerFactoryBase
{
    protected registerStores(container: SimpleContainer, url: URL, routeParameters: Map<string, string>): void
    {
        container.register("IFormPageStore", c => new FormPageStore({
            pageStore: c.resolve("IPageStore")
        }));
        container.register("ISelectPageStore", c => new SelectPageStore({
            pageStore: c.resolve("IPageStore"),
            pageRequest: c.resolve("IPageRequest")
        }));
    }
}