import { Component, OnInit } from '@angular/core';
import { AdminDTO, UsersService } from '../../Services/users.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: AdminDTO[] = [];
  filteredUsers: AdminDTO[] = [];
  pagedUsers: AdminDTO[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  searchQuery: string = '';
  
  // Sorting
  sortColumn: keyof AdminDTO = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.updatePagination();
        this.sortData();
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          this.applyFilter();
        },
        error: (err) => console.error('Error deleting user:', err)
      });
    }
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
    this.currentPage = 1;
    this.updatePagination();
  }

  private searchInUser(user: AdminDTO, query: string): boolean {
    return [
      user.firstName?.toLowerCase(),
      user.lastName?.toLowerCase(),
      user.email?.toLowerCase(),
      user.role?.toLowerCase(),
      user.gender?.toLowerCase()
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
    this.pagedUsers = this.filteredUsers.slice(startIndex, endIndex);
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
    return date ? new DatePipe('en-US').transform(date, 'mediumDate') : null;
  }
}