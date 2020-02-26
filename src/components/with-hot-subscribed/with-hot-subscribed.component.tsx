import React, {ComponentClass, ComponentType} from "react";

function withHotSubscribe<P extends object>(WrappedComponent: ComponentType<P>): ComponentClass<P> {
    return class HotSubscribed extends React.Component<P> {

        constructor(props: Readonly<P>) {
            super(props);
            console.log("withHot constructor");
        }

        onHot = () => this.forceUpdate(
            () => console.log("%cHot updated \"%s\"", 'color: #FFD438;', getDisplayName(WrappedComponent))
        );

        componentDidMount() {
            document.addEventListener("hot", this.onHot);
        }

        componentWillUnmount() {
            document.removeEventListener("hot", this.onHot);
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }
}

function getDisplayName(WrappedComponent: ComponentType<any>): string {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withHotSubscribe;