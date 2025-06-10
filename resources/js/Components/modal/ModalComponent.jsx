import {
    Modal,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@heroui/react";
import { Button } from "@heroui/button";

const ModalComponent = ({
    actionChildren,
    bodyChildren,
    footerChildren,
    title = "Modal",
    url,
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <div className="flex justify-end py-4">
                {typeof actionChildren === "function"
                    ? actionChildren(onOpen)
                    : actionChildren}
            </div>
            <Modal
                isOpen={isOpen}
                placement="top-center"
                onOpenChange={onOpenChange}
            >
                <ModalContent className="">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {title}
                            </ModalHeader>
                            <ModalBody>
                                {typeof bodyChildren === "function"
                                    ? bodyChildren(onClose)
                                    : bodyChildren}
                            </ModalBody>
                            <ModalFooter>
                                {typeof footerChildren === "function"
                                    ? footerChildren(onClose)
                                    : footerChildren}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ModalComponent;
