import withTranslation from "next-translate/withTranslation";

export default function withTranslate(WrappedComponent) {
    return withTranslation(WrappedComponent, "common");
}
