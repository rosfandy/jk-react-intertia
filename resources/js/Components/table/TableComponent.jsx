import Select from "react-select";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import ModalComponent from "../modal/ModalComponent";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";

const TableComponent = (props) => {
    const { datas } = props;
    const { projects, users } = usePage().props;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleDelete = (id) => {
        router.delete(route("squad.delete", id));
    };

    // Convert users to react-select format
    const userOptions = users.map((user) => ({
        value: user.id,
        label: user.name,
    }));

    // Helper function to get user names from IDs
    const getUserNamesByIds = (anggotaIds) => {
        if (!anggotaIds || !Array.isArray(anggotaIds)) return [];

        return anggotaIds.map((id) => {
            const user = users.find((user) => user.id === id);
            return user ? user.name : `User ${id}`;
        });
    };

    const handleSubmit = (e, onClose) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        router.post(
            route("squad.store"),
            {
                name: formData.get("name"),
                general_project_id: formData.get("general_project_id"),
                anggota: selectedUsers.map((user) => user.value),
            },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    return (
        <>
            <Table aria-label="Daftar Squad" selectionMode="multiple">
                <TableHeader>
                    <TableColumn>Nama Squad</TableColumn>
                    <TableColumn>Project ID</TableColumn>
                    <TableColumn>Project Name</TableColumn>
                    <TableColumn>Anggota</TableColumn>
                    <TableColumn>Action</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"Tidak ada data."}>
                    {datas.map((item) => {
                        // Convert item.anggota IDs to react-select format
                        const initialSelectedUsers =
                            item.anggota && Array.isArray(item.anggota)
                                ? item.anggota
                                      .map((anggotaId) => {
                                          const user = users.find(
                                              (user) => user.id === anggotaId
                                          );
                                          return user
                                              ? {
                                                    value: user.id,
                                                    label: user.name,
                                                }
                                              : null;
                                      })
                                      .filter(Boolean) // Remove null values
                                : [];

                        // Get user names for display
                        const anggotaNames = getUserNamesByIds(item.anggota);

                        return (
                            <TableRow key={item.id}>
                                <TableCell>{item.Name}</TableCell>
                                <TableCell>{item.project?.id || "-"}</TableCell>
                                <TableCell>
                                    {item.project?.nama || "-"}
                                </TableCell>
                                <TableCell>
                                    {anggotaNames.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {anggotaNames.map((name, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-200 px-2 py-1 rounded text-xs"
                                                >
                                                    {name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="bg-gray-200 px-2 py-1 rounded text-xs text-gray-500">
                                            Tidak ada anggota
                                        </span>
                                    )}
                                </TableCell>

                                <TableCell>
                                    <div className="flex gap-x-2">
                                        <EditModal
                                            item={item}
                                            projects={projects}
                                            userOptions={userOptions}
                                            initialSelectedUsers={
                                                initialSelectedUsers
                                            }
                                        />
                                        <ModalComponent
                                            title="Yakin ingin menghapus squad?"
                                            url={route("squad.delete", item.id)}
                                            actionChildren={(onOpen) => (
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    onPress={onOpen}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                            footerChildren={(onClose) => (
                                                <Button
                                                    color="danger"
                                                    onPress={() => {
                                                        handleDelete(item.id);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
};

// Separate component for edit modal to handle state properly
const EditModal = ({ item, projects, userOptions, initialSelectedUsers }) => {
    const [selectedUsers, setSelectedUsers] = useState(initialSelectedUsers);
    const [formData, setFormData] = useState({
        name: item.Name,
        general_project_id: item.project?.id || "",
    });

    const handleSubmit = (e, onClose) => {
        e.preventDefault();

        router.put(
            route("squad.update", item.id),
            {
                name: formData.name,
                general_project_id: formData.general_project_id,
                anggota: selectedUsers.map((user) => user.value),
            },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <ModalComponent
            url={route("squad.store")}
            actionChildren={(onOpen) => (
                <Button size="sm" color="primary" onPress={onOpen}>
                    Edit
                </Button>
            )}
            bodyChildren={(onClose) => (
                <form
                    id={`squadForm-${item.id}`}
                    onSubmit={(e) => handleSubmit(e, onClose)}
                >
                    <div className="border focus-within:border-indigo-400 rounded-md mb-4">
                        <span className="text-xs px-3">Name Squad</span>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Name Squad"
                            className="focus:outline-none focus:ring-0 border-none bg-transparent w-full px-3 pt-0"
                        />
                    </div>

                    <div className="border focus-within:border-indigo-400 rounded-md mb-4">
                        <span className="text-xs px-3">Project</span>
                        <select
                            value={formData.general_project_id}
                            name="general_project_id"
                            onChange={handleInputChange}
                            className="w-full px-3 pt-0"
                        >
                            <option value="">Select Project</option>
                            {projects.length === 0 && (
                                <option value="" disabled>
                                    No projects available
                                </option>
                            )}
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
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
                            placeholder="Select members..."
                        />
                    </div>
                </form>
            )}
            footerChildren={(onClose) => (
                <Button
                    color="primary"
                    type="submit"
                    form={`squadForm-${item.id}`}
                >
                    Submit
                </Button>
            )}
        />
    );
};

export default TableComponent;
