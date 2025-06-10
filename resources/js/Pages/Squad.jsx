import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import TableComponent from "@/Components/table/TableComponent";
import ModalComponent from "@/Components/modal/ModalComponent";
import Select from "react-select";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { toast } from "react-toastify";

export default function Squad({ squads, users, projects }) {
    const [squad, setSquad] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { onOpen } = useDisclosure();

    const { props } = usePage();
    const success = props.flash?.success;
    const error = props.flash?.error;

    useEffect(() => {
        setSquad(squads);
    }, [squads]);

    useEffect(() => {
        if (success) {
            toast.success(success);
        }
        if (error) {
            toast.error(error);
        }
    }, [props.flash]);

    const userOptions = users.map((user) => ({
        value: user.id,
        label: user.name || `User ${user.id}`,
    }));

    const handleSubmit = (e, onClose) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData.entries());
        payload.anggota = selectedUsers.map((u) => u.value);

        router.post(route("squad.store"), payload, {
            onSuccess: () => {
                onClose();
                setSelectedUsers([]);
                e.target.reset();
            },
            onError: () => {
                console.log("Submission failed");
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Squad Management
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="px-64 py-8">
                {success && (
                    <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-800 border border-red-300 rounded">
                        {error}
                    </div>
                )}

                <ModalComponent
                    url={route("squad.store")}
                    actionChildren={(onOpen) => (
                        <Button color="primary" onPress={onOpen}>
                            Tambah
                        </Button>
                    )}
                    bodyChildren={(onClose) => (
                        <form
                            id="squadForm"
                            onSubmit={(e) => handleSubmit(e, onClose)}
                        >
                            <div className="border focus-within:border-indigo-400 rounded-md mb-4">
                                <span className="text-xs px-3">Name Squad</span>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name Squad"
                                    className="focus:outline-none focus:ring-0 border-none bg-transparent w-full px-3 pt-0"
                                />
                            </div>

                            <div className="border focus-within:border-indigo-400 rounded-md mb-4">
                                <span className="text-xs px-3">Project</span>
                                <select
                                    name="general_project_id"
                                    className=" w-full px-3 pt-0"
                                >
                                    {projects.length === 0 && (
                                        <option value="" disabled>
                                            No projects available
                                        </option>
                                    )}
                                    {projects.map((project) => (
                                        <option
                                            key={project.id}
                                            value={project.id}
                                        >
                                            {project.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="border focus-within:border-indigo-400 rounded-md mb-4">
                                <span className="text-xs px-1 text-gray-600">
                                    Anggota
                                </span>
                                <Select
                                    isMulti
                                    name="anggota"
                                    options={userOptions}
                                    className="basic-multi-select focus:outline-none"
                                    classNamePrefix="select"
                                    onChange={setSelectedUsers}
                                    value={selectedUsers}
                                />
                            </div>
                        </form>
                    )}
                    footerChildren={(onClose) => (
                        <Button color="primary" type="submit" form="squadForm">
                            Submit
                        </Button>
                    )}
                />
                <TableComponent datas={squad} title="Daftar Squad" />
            </div>
        </AuthenticatedLayout>
    );
}
