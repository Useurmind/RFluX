import { IContainer } from "./IContainer";
import { IContainerBuilder } from "./IContainerBuilder";
import { IContainerRegistration } from "./IContainerRegistration";
import { ICreationRule } from "./ICreationRule";
import { SimpleContainer } from "./SimpleContainer";
import { SimpleContainerRegistration } from "./SimpleContainerRegistration";

/**
 * We use this interface to make resolution of collection registrations
 * aware of multiple instance names.
 */
export interface IResolveWithInstanceName
{
    (container: IContainer, instanceName: string): any;
}

export type RegistrationMap = Map<string, IResolveWithInstanceName | IResolveWithInstanceName[]>;

/**
 * Container builder for { @see SimpleContainer }
 */
export class SimpleContainerBuilder implements IContainerBuilder
{
    private registrationMap: RegistrationMap = new Map();
    private parentContainers: IContainer[] = [];

    /**
     * Add a parent container to the container being build.
     * The container that is build will use the parent container to resolve stuff he does not know.
     * @param parentContainer The parent container.
     */
    public addParentContainer(parentContainer: IContainer)
    {
        this.parentContainers.push(parentContainer);
    }

    /**
     * @inheritDoc
     */
    public register(create: ICreationRule): IContainerRegistration
    {
        // we want singleton behaviour for multiple names here
        const createSingleton = this.getSingletonCreator(create);

        return new SimpleContainerRegistration(this.registrationMap, createSingleton);
    }

    /**
     * @inheritDoc
     */
    public build(): IContainer
    {
        const container = new SimpleContainer(this.registrationMap, this.parentContainers);
        this.registrationMap = new Map();

        return container;
    }

    private getSingletonCreator(create: ICreationRule): IResolveWithInstanceName
    {
        const createSingleton = ((() =>
        {
            let defaultInstance: any = null;
            const namedInstances = new Map<string, any>();
            const createSingletonInner = (container: IContainer, instanceName: string) =>
            {
                let instance = null;
                if (!instanceName)
                {
                    instance = defaultInstance;
                }
                else
                {
                    instance = namedInstances.get(instanceName);
                }

                if (!instance)
                {
                    instance = create(container);
                }

                if (!instanceName)
                {
                    defaultInstance = instance;
                }
                else
                {
                    namedInstances.set(instanceName, instance);
                }

                return instance;
            };

            return createSingletonInner;
        })());

        return createSingleton;
    }
}
