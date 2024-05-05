import classnames from "classnames";
import ErrorMessage from "@/components/form/errorMessage";
import { Field } from "formik";
import { Input as InputUI } from "@/components/ui/input";

interface inputProps {
    name: string;
    label?: string;
    placeholder?: string;
    notice?: string;
    className?: string;
    isShowError?: boolean;
    innerRef?: any;
    [key: string]: any;
}

const CommonInput = ({
    name,
    label,
    placeholder,
    notice,
    className,
    isShowError = true,
    innerRef,
    ...props
}: inputProps): React.ReactNode => {
    return (
        <div className={classnames("form-control", className)}>
            {label ? (
                <label className="label">
                    <span className="label-text">{label}</span>
                </label>
            ) : null}
            <Field name={name}>
                {({
                    field: { value },
                    form: { setFieldValue, setFieldTouched },
                    meta,
                }: {
                    field: { value: String };
                    form: { setFieldValue: Function; setFieldTouched: Function };
                    meta: any;
                }) => {
                    //是否输入框有错误
                    let hasError = false;
                    if (isShowError) {
                        if (meta.touched && meta.error) {
                            hasError = true;
                        }
                    }
                    return (
                        <div className="form-input-wapper">
                            <InputInner
                                innerRef={innerRef ? innerRef : null}
                                placeholder={placeholder}
                                hasError={hasError}
                                label={label}
                                value={value}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFieldValue(name, e.target.value)
                                }
                                onBlur={() => setFieldTouched(name, true)}
                                {...props}
                            />
                            {isShowError ? <ErrorMessage name={name} /> : null}
                            {notice ? (
                                <div className="text-base text-gray-600 pt-1">{notice}</div>
                            ) : null}
                        </div>
                    );
                }}
            </Field>
        </div>
    );
};

interface inputInnerProps {
    color?: string;
    className?: string;
    innerRef?: any;
    hasError?: boolean;
    [key: string]: any;
}

const InputInner = ({
    field,
    color,
    className,
    innerRef,
    hasError,
    ...props
}: inputInnerProps): React.ReactNode => {
    let c = "input w-full";
    if (className) {
        c = className;
    }
    return (
        <InputUI
            ref={innerRef ? innerRef : null}
            {...field}
            {...props}
            className={classnames(c, { yellow: color == "yellow" }, { "input-error": hasError })}
        />
    );
};

export default CommonInput;
