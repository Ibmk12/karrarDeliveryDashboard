<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="orange">
            <h4 class="title">Users</h4>
            <p class="category">Manage users</p>
          </md-card-header>
          <md-card-content>
            <div class="md-layout">
              <div class="md-layout-item md-size-100 text-right">
                <md-button data-background-color="orange" class="md-raised md-success" @click="openAddDialog">Add User</md-button>
              </div>
            </div>

            <md-table v-model="users" :table-header-color="tableHeaderColor">
              <md-table-row 
                slot="md-table-row" 
                slot-scope="{ item }" 
                :class="{ 'disabled-row': !item.enabled }"
              >
                <md-table-cell md-label="ID">{{ item.id }}</md-table-cell>
                <md-table-cell md-label="Name">
                  {{ item.firstName }} {{ item.middleName }} {{ item.lastName }}
                  <md-chip v-if="!item.enabled" class="md-accent md-small">Disabled</md-chip>
                </md-table-cell>
                <md-table-cell md-label="Email">{{ item.email }}</md-table-cell>
                <md-table-cell md-label="Phone">{{ item.phone }}</md-table-cell>
                <md-table-cell md-label="Role">{{ item.role }}</md-table-cell>
                <md-table-cell md-label="Actions">
                  <md-button class="md-just-icon md-simple" :class="{'md-warning': !item.enabled, 'md-info': item.enabled}" @click="toggleUserStatus(item)">
                    <md-icon v-if="item.enabled">toggle_on</md-icon>
                    <md-icon v-else>toggle_off</md-icon>
                  </md-button>
                  <md-button class="md-just-icon md-simple md-primary" @click="editUser(item)">
                    <md-icon>edit</md-icon>
                  </md-button>
                  <md-button class="md-just-icon md-simple md-danger" @click="deleteUser(item)">
                    <md-icon>delete</md-icon>
                  </md-button>
                </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
    </div>

    <!-- Add User Dialog -->
    <md-dialog :md-active.sync="showAddDialog">
      <md-dialog-title>Add User</md-dialog-title>

      <md-dialog-content>
        <form>
          <md-field>
            <label>First Name</label>
            <md-input v-model="newUser.firstName" required></md-input>
          </md-field>

          <md-field>
            <label>Middle Name</label>
            <md-input v-model="newUser.middleName"></md-input>
          </md-field>

          <md-field>
            <label>Last Name</label>
            <md-input v-model="newUser.lastName" required></md-input>
          </md-field>

          <md-field>
            <label>Email</label>
            <md-input v-model="newUser.email" type="email" required></md-input>
          </md-field>

          <md-field>
            <label>Phone</label>
            <md-input v-model="newUser.phone" required></md-input>
          </md-field>

          <md-field>
            <label>Password</label>
            <md-input v-model="newUser.password" type="password" required></md-input>
          </md-field>

          <md-field>
            <label>Role</label>
            <md-select v-model="newUser.role" required>
              <md-option value="ADMIN">Admin</md-option>
              <md-option value="USER">User</md-option>
            </md-select>
          </md-field>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-simple" @click="showAddDialog = false">Cancel</md-button>
        <md-button class="md-raised md-success" @click="addUser">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
    
    <!-- Edit User Dialog -->
    <md-dialog :md-active.sync="showEditDialog">
      <md-dialog-title>Edit User</md-dialog-title>

      <md-dialog-content>
        <form>
          <md-field>
            <label>First Name</label>
            <md-input v-model="currentUser.firstName" required></md-input>
          </md-field>

          <md-field>
            <label>Middle Name</label>
            <md-input v-model="currentUser.middleName"></md-input>
          </md-field>

          <md-field>
            <label>Last Name</label>
            <md-input v-model="currentUser.lastName" required></md-input>
          </md-field>

          <md-field>
            <label>Email</label>
            <md-input v-model="currentUser.email" type="email" required></md-input>
          </md-field>

          <md-field>
            <label>Phone</label>
            <md-input v-model="currentUser.phone" required></md-input>
          </md-field>

          <md-field>
            <label>Role</label>
            <md-select v-model="currentUser.role" required>
              <md-option value="ADMIN">Admin</md-option>
              <md-option value="USER">User</md-option>
            </md-select>
          </md-field>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-simple" @click="showEditDialog = false">Cancel</md-button>
        <md-button class="md-raised md-success" @click="updateUser">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { userService } from '@/services/UserService';

export default {
  name: "Users",
  data() {
    return {
      tableHeaderColor: "orange",
      users: [],
      showAddDialog: false,
      showEditDialog: false,
      newUser: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: "USER",
        enabled: true
      },
      currentUser: {
        id: null,
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "USER",
        enabled: true
      }
    };
  },
  methods: {
    openAddDialog() {
      this.resetNewUserForm();
      this.showAddDialog = true;
    },
    async loadUsers() {
      try {
        const response = await userService.getAllUsers();
        // Handle both single user and array of users
        if (response.data && Array.isArray(response.data)) {
          this.users = response.data;
        } else if (response.data) {
          // If it's a single user object, convert to array
          this.users = [response.data];
        } else {
          this.users = [];
        }
        console.log('Users loaded:', this.users);
      } catch (error) {
        console.error('Error loading users:', error);
        this.$notify({
          message: 'Failed to load users',
          icon: 'error',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'danger'
        });
      }
    },
    editUser(user) {
      // Create a copy without the password field
      this.currentUser = { 
        ...user
      };
      this.showEditDialog = true;
    },
    async toggleUserStatus(user) {
      const action = user.enabled ? 'disable' : 'enable';
      if (confirm(`Are you sure you want to ${action} user ${user.firstName} ${user.lastName}?`)) {
        try {
          if (user.enabled) {
            await userService.disableUser(user.id);
          } else {
            await userService.enableUser(user.id);
          }
          
          this.$notify({
            message: `User ${action}d successfully`,
            type: 'success'
          });
          
          await this.loadUsers(); // Refresh the list
        } catch (error) {
          console.error(`Error ${action}ing user:`, error);
          this.$notify({
            message: error.response?.data?.message || `Failed to ${action} user`,
            type: 'danger'
          });
        }
      }
    },
    async deleteUser(user) {
      if (confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}?`)) {
        try {
          await userService.deleteUser(user.id);
          this.$notify({
            message: 'User deleted successfully',
            icon: 'check',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'success'
          });
          await this.loadUsers(); // Refresh the list
        } catch (error) {
          console.error('Error deleting user:', error);
          this.$notify({
            message: 'Failed to delete user',
            icon: 'error',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'danger'
          });
        }
      }
    },
    async addUser() {
      try {
        const response = await userService.addNewUser(this.newUser);
        this.$notify({
          message: response.message || 'User added successfully',
          icon: 'check',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'success'
        });
        await this.loadUsers(); // Refresh the list
        this.showAddDialog = false;
        this.resetNewUserForm();
      } catch (error) {
        console.error('Error adding user:', error);
        this.$notify({
          message: error.response?.data?.message || 'Failed to add user',
          icon: 'error',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'danger'
        });
      }
    },
    
    async updateUser() {
      try {
        const response = await userService.updateUser(this.currentUser.id, this.currentUser);
        this.$notify({
          message: response.message || 'User updated successfully',
          icon: 'check',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'success'
        });
        await this.loadUsers(); // Refresh the list
        this.showEditDialog = false;
      } catch (error) {
        console.error('Error updating user:', error);
        this.$notify({
          message: error.response?.data?.message || 'Failed to update user',
          icon: 'error',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'danger'
        });
      }
    },
    resetNewUserForm() {
      // Reset to empty values
      this.newUser = {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: "USER",
        enabled: true
      };
    }
  },
  created() {
    this.loadUsers();
  }
};
</script>

<style>
.disabled-row {
  opacity: 0.7;
  background-color: #ffebee !important;
}

.md-chip.md-small {
  height: 20px;
  padding: 0 8px;
  margin-left: 8px;
  font-size: 12px;
}

.disabled-row .md-button {
  opacity: 0.5;
}
</style>
