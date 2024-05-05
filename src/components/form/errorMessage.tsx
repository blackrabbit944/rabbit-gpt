import { ErrorMessage } from "formik";

interface CustomErrorMessage {
    name: string;
}
const CustomErrorMessage = ({ name }: CustomErrorMessage) => {
    return (
        <ErrorMessage
            name={name}
            render={(msg: string) => <div className="input-error-msg">{msg}</div>}
        />
    );
};

export default CustomErrorMessage;
