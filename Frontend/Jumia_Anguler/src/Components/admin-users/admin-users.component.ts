import { Component, OnInit } from '@angular/core';
import { AdminDTO, UsersService } from '../../Services/SellerServ/users.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
  providers: [DatePipe]
})
export class AdminUsersComponent implements OnInit {
  users: AdminDTO[] = [];
  filteredUsers: AdminDTO[] = [];
  pagedUsers: AdminDTO[] = [];
  groupedUsers: { [role: string]: AdminDTO[] } = {};
  // Pagination
  displayedGroupedUsers: { [role: string]: AdminDTO[] } = {};
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  searchQuery: string = '';
  objectKeys = Object.keys;

  expandedRoles: { [role: string]: boolean } = {};


  // Sorting
  sortColumn: keyof AdminDTO = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';
  isLoading!: boolean;

  constructor(private usersService: UsersService ,   private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
      }
    });
  }

  groupByRole(users: AdminDTO[]): { [role: string]: AdminDTO[] } {
    return users.reduce((groups, user) => {
      const role = user.role || 'Other';
      groups[role] = groups[role] || [];
      groups[role].push(user);
      return groups;
    }, {} as { [role: string]: AdminDTO[] });
  }

  deleteUser(id: string, userName: string): void {
    Swal.fire({
      title: 'Delete User',
      html: `Are you sure you want to delete <strong>${userName}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF7800', 
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#FFF5EB', 
      iconColor: '#FF7800',
      customClass: {
        popup: 'jumia-swal-popup',
        title: 'jumia-swal-title',
        confirmButton: 'jumia-swal-confirm-btn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.deleteUser(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'User has been deleted.',
              icon: 'success',
              confirmButtonColor: '#FF7800',
              timer: 2000,
              timerProgressBar: true
            });
            this.loadUsers(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete user.',
              icon: 'error',
              confirmButtonColor: '#FF7800'
            });
            console.error('Error deleting user:', err);
          }
        });
      }
    })
  }
  toggleRole(role: string) {
    this.expandedRoles[role] = !this.expandedRoles[role];
  }
  
  isRoleExpanded(role: string): boolean {
    return this.expandedRoles[role] !== false; // Default to true
  }
  applyFilter(): void {
    if (!this.searchQuery.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredUsers = this.users.filter(user => 
        this.searchInUser(user, query)
      );
    }
    this.sortData();


    this.groupedUsers = this.groupByRole(this.filteredUsers);

    this.currentPage = 1;
    this.updatePagination();
  }
  private searchInUser(user: AdminDTO, query: string): boolean {
    return [
      user.firstName?.toLowerCase(),
      user.lastName?.toLowerCase(),
      user.email?.toLowerCase(),
      user.role?.toLowerCase(),
      user.gender?.toLowerCase(),
      user.storeName?.toLowerCase(),
      user.storeAddress?.toLowerCase(),
      this.formatDate(user.createdAt)?.toLowerCase(),
      this.formatDate(user.dateOfBirth)?.toLowerCase()
    ].some(value => value?.includes(query));
  }

  sort(column: keyof AdminDTO): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortData();
    this.updatePagination();
  }

  private sortData(): void {
    this.filteredUsers.sort((a, b) => {
      const aValue = this.getSortValue(a[this.sortColumn]);
      const bValue = this.getSortValue(b[this.sortColumn]);

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private getSortValue(value: any): string | number | Date {
    if (value instanceof Date) return value.getTime();
    if (typeof value === 'number') return value;
    return String(value ?? '').toLowerCase();
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredUsers.length / this.itemsPerPage));
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    // Get paginated users
    const pagedUsers = this.filteredUsers.slice(startIndex, endIndex);
    
    // Group only the paginated users for display
    this.displayedGroupedUsers = this.groupByRole(pagedUsers);
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const maxVisiblePages = 5;
    const pages: number[] = [];
    let startPage = 1;
    let endPage = this.totalPages;

    if (this.totalPages > maxVisiblePages) {
      const half = Math.floor(maxVisiblePages / 2);
      startPage = Math.max(1, this.currentPage - half);
      endPage = startPage + maxVisiblePages - 1;

      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getToValue(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
  }

  getSortIcon(column: keyof AdminDTO): string {
    if (this.sortColumn !== column) return 'bi-arrow-down-up';
    return this.sortDirection === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }

  formatDate(date?: Date): string | null {
    if (!date) return null;
    return this.datePipe.transform(date, 'mediumDate');
  }

 
  getSellerTooltip(user: AdminDTO): string {
    if (user.role === 'Seller') {
      return `Store: ${user.storeName}\nAddress: ${user.storeAddress}`;
    }
    return '';
  }

}