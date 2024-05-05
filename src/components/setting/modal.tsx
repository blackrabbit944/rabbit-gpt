import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import Input from "@/components/form/input";
import { setCache, getCache } from "@/helper/local";
import { Formik, Form, Field, FieldProps } from "formik";
import { useToast } from "@/components/ui/use-toast";

export default function SettingModal() {
    const [open, setOpen] = React.useState(false);

    let formRef = React.useRef<any>(null);
    const { toast } = useToast();
    ///读取本地配置
    let openai_api_key = getCache("openai_api_key") || "";
    let claude_api_key = getCache("claude_api_key") || "";

    let handleSubmit = (data: { openai_api_key: string; claude_api_key: string }) => {
        const { openai_api_key, claude_api_key } = data;

        ///验证openai_api_key格式
        if (openai_api_key) {
            if (!openai_api_key.startsWith("sk-")) {
                toast({
                    variant: "destructive",
                    title: "OPENAI api key  error",
                    description: "Please check your openai api key input.",
                });
                return;
            }
            setCache("openai_api_key", openai_api_key);
        }

        ///验证claude_api_key格式
        if (claude_api_key) {
            if (!claude_api_key.startsWith("sk-")) {
                toast({
                    variant: "destructive",
                    title: "Claude api key  error",
                    description: "Please check your openai api key input.",
                });
                return;
            }
            setCache("claude_api_key", claude_api_key);
        }

        ///保存到本地
        toast({
            title: "Settings saved",
            description: "All settings have been saved successfully.",
        });

        ///关闭弹窗
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="mx-4 flex justify-start px-5 text-sm mb-1">
                    <Cog8ToothIcon className="w-5 h-5 mr-2" />
                    <div className="">Settings</div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        all settings stored in your browser , no one could read it
                    </DialogDescription>
                </DialogHeader>

                <Formik
                    innerRef={formRef}
                    initialValues={{
                        openai_api_key: openai_api_key,
                        claude_api_key: claude_api_key,
                    }}
                    // validationSchema={FormSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors }) => {
                        // console.log("errors", errors, values);
                        return (
                            <Form className="">
                                <Field name="content">
                                    {({
                                        field, // { name, value, onChange, onBlur }
                                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                        meta,
                                    }: FieldProps<FormValues>) => (
                                        <>
                                            <div className="mb-4">
                                                <Input
                                                    label="OPENAI api key"
                                                    name="openai_api_key"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <Input
                                                    label="Claude api key"
                                                    name="claude_api_key"
                                                />
                                            </div>
                                        </>
                                    )}
                                </Field>
                            </Form>
                        );
                    }}
                </Formik>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="default"
                        onClick={() => {
                            formRef.current.submitForm();
                        }}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
