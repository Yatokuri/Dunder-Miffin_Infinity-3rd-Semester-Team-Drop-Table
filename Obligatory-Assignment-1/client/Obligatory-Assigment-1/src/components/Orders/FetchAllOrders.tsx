import React, { useEffect, useState } from "react";
import {Api} from "../../../Api.ts";
import { useAtom } from "jotai";
import {orderStatusAtom} from "../../atoms/OrderStatusAtoms.ts";
import { useNavigate } from 'react-router-dom';
import {searchAtom} from "../../atoms/atoms.ts";
import {orderAtom} from "../../atoms/OrderEntryAtoms.ts";
import StatusChange from "./OrderStatusChange.tsx";






// Inline TableCell component
const TableCell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <td className="border border-gray-300 px-4 py-2">
            {children}
        </td>
    );
};

export const MyApi = new Api();


function AddOrder() {
    const navigate = useNavigate();
    const [orders, setOrders] = useAtom(orderAtom);
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [statuses] = useAtom(orderStatusAtom);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [searchQuery] = useAtom(searchAtom); // Use the navbar search

    useEffect(() => {
        setLoading(true); // Set loading to true when fetching starts
        MyApi.api.orderGetAllOrders()
            .then((response) => {
                // @ts-expect-error: Ignore an error there don't exit
                setOrders(response.data);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
                setError("Failed to load orders. Please try again later."); // Set error message
                setOrders([]); // Clear orders on error
            })
            .finally(() => {
                setLoading(false); // Set loading to false after the API call
            });
    }, [setOrders]);

    // Handle filtering orders by status and search query
    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === "All" || order.status === filterStatus;
        const matchesSearch =
            order.id.toString().includes(searchQuery) || // Search by ID
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by Customer Name
            order.totalAmount.toString().includes(searchQuery) || // Search by Total Amount
            new Date(order.deliveryDate).toLocaleDateString().includes(searchQuery) || // Search by Delivery Date
            new Date(order.orderDate).toLocaleDateString().includes(searchQuery); // Search by Order Date
        return matchesStatus && matchesSearch; // Combine filters
    });

    const handleCheckOrder = (orderId: number) => {
        navigate(`/admin/allOrders/${orderId}`);
    };

    return (
        <div>
            {/* Filter dropdown for order status */}
            <div className="mb-4">
                <label htmlFor="filterStatus" className="mr-2">Filter by Status:</label>
                <select
                    id="filterStatus"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border rounded p-1"
                >
                    <option value="All">All</option>
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {/* Only render the table if not loading */}
            <div className="overflow-x-auto">
                <table className="table-auto border-collapse w-full min-w-[800px]">
                    <thead>
                    <tr>
                        <TableCell>Id</TableCell>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Total Amount</TableCell>
                        <TableCell>Order Date</TableCell>
                        <TableCell>Delivery Date</TableCell>
                        <TableCell>Check Order</TableCell>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={7}>Loading...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={7} className="text-red-500 py-4">{error}</td>
                        </tr>
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>
                                    <StatusChange
                                        orderId={order.id}
                                        currentStatus={order.status}
                                        onStatusChange={(newStatus) => {
                                            setOrders(orders.map((o) =>
                                                o.id === order.id ? { ...o, status: newStatus } : o
                                            ));
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{order.totalAmount}$</TableCell>
                                <TableCell>
                                    {new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString()}
                                </TableCell>
                                <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <button onClick={() => handleCheckOrder(order.id)} className="btn btn-primary px-0.5 py-0.5">
                                        Check Order
                                    </button>
                                </TableCell>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7}>No Orders found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AddOrder;