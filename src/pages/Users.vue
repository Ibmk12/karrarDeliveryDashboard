<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="orange" class="k-card-head">
            <div>
              <h4 class="title">{{ $tt('Users') }}</h4>
              <p class="category">{{ $tt('Manage users') }}</p>
            </div>
            <md-button class="md-raised md-primary k-head-action" @click="openAddDialog">
              <md-icon>person_add</md-icon> {{ $tt('Add User') }}
            </md-button>
          </md-card-header>
          <md-card-content>
            <div class="k-toolbar k-user-toolbar">
              <div class="k-toolbar-group">
                <div class="k-search-box">
                  <md-icon>search</md-icon>
                  <input
                    v-model="userSearch"
                    type="search"
                    :placeholder="$tt('Search name, email or phone')"
                    :aria-label="$tt('Search name, email or phone')"
                    @input="userPage = 0"
                  />
                </div>
                <div class="k-role-filter" role="group" :aria-label="$tt('Role')">
                  <button type="button" :class="{ active: roleFilter === '' }" @click="setRoleFilter('')">{{ $tt('All') }}</button>
                  <button type="button" :class="{ active: roleFilter === 'ADMIN' }" @click="setRoleFilter('ADMIN')">{{ $tt('Admin') }}</button>
                  <button type="button" :class="{ active: roleFilter === 'USER' }" @click="setRoleFilter('USER')">{{ $tt('User') }}</button>
                </div>
              </div>
              <span class="k-selection-hint">
                <md-icon>group</md-icon>
                {{ $tt('{n} users', { n: filteredUsers.length }) }}
              </span>
            </div>

            <md-table v-model="pagedUsers" :table-header-color="tableHeaderColor">
              <md-table-row 
                slot="md-table-row" 
                slot-scope="{ item }" 
                :class="{ 'disabled-row': !item.enabled }"
              >
                <md-table-cell :md-label="$tt('ID')"><span class="k-id">#{{ item.id }}</span></md-table-cell>
                <md-table-cell :md-label="$tt('Name')">
                  <span class="k-user-cell">
                    <span class="k-initials" :class="'tone-' + (item.id % 5)">{{ initials(item) }}</span>
                    <strong>{{ item.firstName }} {{ item.middleName }} {{ item.lastName }}</strong>
                  </span>
                  <md-chip v-if="!item.enabled" class="md-accent md-small">{{ $tt('Disabled') }}</md-chip>
                </md-table-cell>
                <md-table-cell :md-label="$tt('Email')">{{ item.email }}</md-table-cell>
                <md-table-cell :md-label="$tt('Phone')">{{ item.phone }}</md-table-cell>
                <md-table-cell :md-label="$tt('Role')"><span class="k-role" :class="{ 'is-admin': item.role === 'ADMIN' }">{{ $tt(item.role) }}</span></md-table-cell>
                <md-table-cell :md-label="$tt('Actions')">
                  <md-button class="md-just-icon md-simple" :class="{'md-warning': !item.enabled, 'md-info': item.enabled}" @click="toggleUserStatus(item)">
                    <md-icon v-if="item.enabled">toggle_on</md-icon>
                    <md-icon v-else>toggle_off</md-icon>
                    <md-tooltip md-direction="top">{{ $tt(item.enabled ? 'Disable user' : 'Enable user') }}</md-tooltip>
                  </md-button>
                  <md-button class="md-just-icon md-simple md-primary" @click="editUser(item)">
                    <md-icon>edit</md-icon>
                    <md-tooltip md-direction="top">{{ $tt('Edit') }}</md-tooltip>
                  </md-button>
                  <md-button class="md-just-icon md-simple md-danger" @click="deleteUser(item)">
                    <md-icon>delete_outline</md-icon>
                    <md-tooltip md-direction="top">{{ $tt('Delete') }}</md-tooltip>
                  </md-button>
                </md-table-cell>
              </md-table-row>
            </md-table>

            <div v-if="filteredUsers.length === 0" class="k-empty">
              <md-icon>person_search</md-icon>
              <h4>{{ $tt('No users found') }}</h4>
              <p>{{ $tt('Try changing or clearing the filters above.') }}</p>
            </div>

            <div class="pagination-container" v-if="userPages > 1">
              <div class="pagination-info">
                {{ $tt('Page {a} of {b}', { a: userPage + 1, b: userPages }) }}
              </div>
              <div class="pagination-controls">
                <md-button class="md-icon-button md-raised" :disabled="userPage === 0" @click="userPage--">
                  <md-icon>chevron_left</md-icon>
                </md-button>
                <span class="page-numbers">
                  <span
                    v-for="n in userPages"
                    :key="n"
                    :class="['page-number', userPage === n - 1 ? 'active' : '']"
                    @click="userPage = n - 1"
                  >{{ n }}</span>
                </span>
                <md-button class="md-icon-button md-raised" :disabled="userPage >= userPages - 1" @click="userPage++">
                  <md-icon>chevron_right</md-icon>
                </md-button>
              </div>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>

    <!-- Add User Dialog -->
    <md-dialog :md-active.sync="showAddDialog" class="k-wide-dialog">
      <md-dialog-title>{{ $tt('Add User') }}</md-dialog-title>

      <md-dialog-content>
        <form class="k-form-grid">
          <md-field>
            <label>{{ $tt('First Name') }}</label>
            <md-input v-model="newUser.firstName" required></md-input>
          </md-field>

          <md-field>
            <label>{{ $tt('Middle Name') }}</label>
            <md-input v-model="newUser.middleName"></md-input>
          </md-field>

          <md-field>
            <label>{{ $tt('Last Name') }}</label>
            <md-input v-model="newUser.lastName" required></md-input>
          </md-field>

          <md-field>
            <label>{{ $tt('Email') }}</label>
            <md-input v-model="newUser.email" type="email" required></md-input>
          </md-field>

          <md-field>
            <label>{{ $tt('Phone') }}</label>
            <md-input v-model="newUser.phone" required></md-input>
          </md-field>

          <md-field>
            <label>{{ $tt('Password') }}</label>
            <md-input v-model="newUser.password" type="password" required></md-input>
          </md-field>

          <div class="k-dialog-select">
            <k-search-select
              v-model="newUser.role"
              :options="[{ value: 'ADMIN', label: 'Admin' }, { value: 'USER', label: 'User' }]"
              value-key="value"
              label-key="label"
              :label="$tt('Role') + ' *'"
              placeholder="Select role"
              :searchable="false"
              :clearable="false"
            ></k-search-select>
          </div>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-simple" @click="showAddDialog = false">{{ $tt('Cancel') }}</md-button>
        <md-button class="md-raised md-success" @click="addUser">{{ $tt('Save') }}</md-button>
      </md-dialog-actions>
    </md-dialog>
    
    <!-- Edit User Dialog -->
    <md-dialog :md-active.sync="showEditDialog" class="k-wide-dialog">
      <md-dialog-title>{{ $tt('Edit User') }}</md-dialog-title>

      <md-dialog-content>
        <form class="k-form-grid">
          <md-field>
            <label>{{ $tt('First Name') }}</label>
            <md-input v-model="currentUser.firstName" required></md-input>
          </md-field>

          <md-field>
            <label>{{ $tt('Middle Name') }}</label>
            <md-input v-model="currentUser.middleName"></md-input>
          </md-field>

          <md-field>
            <label>{{ $tt('Last Name') }}</label>
            <md-input v-model="currentUser.lastName" required></md-input>
          </md-field>

          <md-field>
            <label>{{ $tt('Email') }}</label>
            <md-input v-model="currentUser.email" type="email" required></md-input>
          </md-field>

          <md-field>
            <label>{{ $tt('Phone') }}</label>
            <md-input v-model="currentUser.phone" required></md-input>
          </md-field>

          <div class="k-dialog-select">
            <k-search-select
              v-model="currentUser.role"
              :options="[{ value: 'ADMIN', label: 'Admin' }, { value: 'USER', label: 'User' }]"
              value-key="value"
              label-key="label"
              :label="$tt('Role') + ' *'"
              placeholder="Select role"
              :searchable="false"
              :clearable="false"
            ></k-search-select>
          </div>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-simple" @click="showEditDialog = false">{{ $tt('Cancel') }}</md-button>
        <md-button class="md-raised md-success" @click="updateUser">{{ $tt('Save') }}</md-button>
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
      userSearch: "",
      roleFilter: "",
      userPage: 0,
      usersPerPage: 10,
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
    initials(u) {
      const a = (u.firstName || "").trim()[0] || "";
      const b = (u.lastName || "").trim()[0] || "";
      return (a + b).toUpperCase() || "?";
    },
    setRoleFilter(r) {
      this.roleFilter = r;
      this.userPage = 0;
    },
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
      if (await this.$kConfirm({ title: `${action === "disable" ? "Disable" : "Enable"} user?`, message: action === "disable" ? "{name} will be disabled." : "{name} will be enabled.", params: { name: `${user.firstName} ${user.lastName}` }, confirmText: action === "disable" ? "Disable" : "Enable", danger: action === "disable", icon: action === "disable" ? "block" : "check_circle" })) {
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
      if (await this.$kConfirm({ title: "Delete user?", message: "{name} will be permanently deleted.", params: { name: `${user.firstName} ${user.lastName}` }, confirmText: "Delete", danger: true })) {
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
  computed: {
    filteredUsers() {
      const q = this.userSearch.trim().toLowerCase();
      return this.users.filter((u) => {
        if (this.roleFilter && String(u.role).toUpperCase() !== this.roleFilter) return false;
        if (!q) return true;
        return [u.firstName, u.middleName, u.lastName, u.email, u.phone]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
    },
    userPages() {
      return Math.ceil(this.filteredUsers.length / this.usersPerPage);
    },
    pagedUsers() {
      const start = this.userPage * this.usersPerPage;
      return this.filteredUsers.slice(start, start + this.usersPerPage);
    },
  },
  watch: {
    userPages(n) {
      if (this.userPage > 0 && this.userPage >= n) this.userPage = Math.max(0, n - 1);
    },
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
