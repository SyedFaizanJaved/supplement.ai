import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import API_URL from "../config";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Search,
  SortAsc,
  ChevronLeft,
  SortDesc,
  Edit2,
  Trash2,
} from "lucide-react";
import { Pagination } from "../components/ui/pagination";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useToast } from "../components/ui/use-toast";
import styles from "./Admin.module.css";

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    user || {
      name: "",
      email: "",
      phone: "",
      status: "active",
      role: "user",
    }
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formActions}>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Retrieve token from storage (adjust as needed)
  const token = localStorage.getItem("token");

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/users/admin/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      // Map API response to local user objects.
      const mappedUsers = response.data.map((user) => ({
        id: user.id, // Ensure backend returns a numeric id
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone_number,
        status: user.is_active ? "active" : "inactive",
        lastLogin: user.last_login,
        role: user.user_role.map((r) => r.role_name).join(", "),
      }));
      setUsers(mappedUsers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.phone && user.phone.includes(searchTerm))
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((user) => user.status === statusFilter);
    }
    if (roleFilter !== "all") {
      result = result.filter((user) =>
        user.role.toLowerCase().includes(roleFilter.toLowerCase())
      );
    }
    result.sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredUsers(result);
  }, [users, searchTerm, sortColumn, sortDirection, statusFilter, roleFilter]);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  // Update a user via PATCH.
  const handleUpdateUser = async (updatedUser) => {
    if (!updatedUser.id) {
      toast({
        title: "Error",
        description: "User id is missing.",
        variant: "destructive",
      });
      return;
    }
    try {
      // Split name into first and last names.
      const [firstName, ...lastNameParts] = updatedUser.name.split(" ");
      const patchData = {
        email: updatedUser.email,
        first_name: firstName,
        last_name: lastNameParts.join(" "),
        phone_number: updatedUser.phone,
      };
      const userIdentifier = updatedUser.id;
      // Call the PATCH endpoint.
      await axios.patch(
        `${API_URL}/api/v1/users/admin/${userIdentifier}/`,
        patchData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      // Update local state.
      setUsers(
        users.map((user) =>
          user.id === userIdentifier ? updatedUser : user
        )
      );
      setEditingUser(null);
      toast({
        title: "User Updated",
        description: "User information has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user.",
        variant: "destructive",
      });
    }
  };

  // Open delete dialog.
  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  // Delete a user via DELETE.
  const confirmDelete = async () => {
    if (!userToDelete.id) {
      toast({
        title: "Error",
        description: "User id is missing.",
        variant: "destructive",
      });
      return;
    }
    try {
      const userIdentifier = userToDelete.id;
      await axios.delete(`${API_URL}/api/v1/users/admin/${userIdentifier}/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      setUsers(users.filter((u) => u.id !== userIdentifier));
      setIsDeleteDialogOpen(false);
      toast({
        title: "User Deleted",
        description: `${userToDelete.name} has been removed from the system.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={styles.backButton}
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className={styles.backIcon} />
        Back
      </Button>

      <Card className={styles.dashboardCard}>
        <div className={styles.dashboardHeader}>
          <h2 className={styles.dashboardTitle}>User Dashboard</h2>
        </div>

        <div className={styles.dashboardContent}>
          <div className={styles.controls}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => handleSort("name")}
                    className={styles.sortableHeader}
                  >
                    Name{" "}
                    {sortColumn === "name" && (
                      <span className={styles.sortIcon}>
                        {sortDirection === "asc" ? (
                          <SortAsc size={14} />
                        ) : (
                          <SortDesc size={14} />
                        )}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("email")}
                    className={styles.sortableHeader}
                  >
                    Email{" "}
                    {sortColumn === "email" && (
                      <span className={styles.sortIcon}>
                        {sortDirection === "asc" ? (
                          <SortAsc size={14} />
                        ) : (
                          <SortDesc size={14} />
                        )}
                      </span>
                    )}
                  </TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead
                    onClick={() => handleSort("lastLogin")}
                    className={styles.sortableHeader}
                  >
                    Last Login{" "}
                    {sortColumn === "lastLogin" && (
                      <span className={styles.sortIcon}>
                        {sortDirection === "asc" ? (
                          <SortAsc size={14} />
                        ) : (
                          <SortDesc size={14} />
                        )}
                      </span>
                    )}
                  </TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id} className={styles.tableRow}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Badge className={`${styles.badge} ${styles[user.status]}`}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>
                      <Badge className={`${styles.badge} ${styles[user.role]}`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={styles.actionButtons}>
                        <Button
                          variant="outline"
                          className={styles.editButton}
                          onClick={() => handleEdit(user)}
                        >
                          <Edit2 size={14} className={styles.buttonIcon} /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className={styles.deleteButton}
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 size={14} className={styles.buttonIcon} /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            className={styles.pagination}
            currentPage={currentPage}
            totalCount={filteredUsers.length}
            pageSize={usersPerPage}
            onPageChange={setCurrentPage}
          />
        </div>

        <Dialog
          open={editingUser !== null}
          onOpenChange={() => setEditingUser(null)}
        >
          <DialogContent className={styles.dialogContent}>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <UserForm
              user={editingUser}
              onSubmit={handleUpdateUser}
              onCancel={() => setEditingUser(null)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className={styles.dialogContent}>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <Alert variant="destructive">
              <AlertDescription>
                Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
              </AlertDescription>
            </Alert>
            <div className={styles.dialogActions}>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                className={styles.deleteButton}
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
};

export default AdminDashboard;
