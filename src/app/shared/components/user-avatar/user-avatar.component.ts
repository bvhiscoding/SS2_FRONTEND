import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent {  @Input() imageUrl: string | null = null;
  @Input() fullName: string = '';
  @Input() userName: string = ''; // Thêm userName property
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showEditButton: boolean = false;
  @Input() showOnlineStatus: boolean = true; // Control online status indicator visibility
  @Input() isClickable: boolean = false;
  @Input() customClass: string = ''; // Thêm customClass property
  @Output() avatarClick = new EventEmitter<void>();
  @Output() editClick = new EventEmitter<void>();  /**
   * Tạo chữ cái viết tắt từ tên đầy đủ (tối ưu cho tên tiếng Việt)
   */
  getInitials(): string {
    // Ưu tiên fullName, nếu không có thì dùng userName
    const nameToUse = this.fullName?.trim() || this.userName?.trim() || '';
    
    if (!nameToUse || nameToUse === '') {
      return 'U'; // Default cho User
    }

    // Loại bỏ khoảng trắng thừa và tách tên
    const names = nameToUse.trim().split(/\s+/).filter(name => name.length > 0);
    
    if (names.length === 0) {
      return 'U';
    }
    
    if (names.length === 1) {
      // Nếu chỉ có 1 từ, lấy 2 ký tự đầu
      const name = names[0];
      if (name.length === 1) {
        return name.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    } else if (names.length === 2) {
      // Nếu có 2 từ, lấy ký tự đầu của mỗi từ
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    } else {
      // Nếu có nhiều hơn 2 từ (phổ biến với tên tiếng Việt)
      // Cấu trúc tên tiếng Việt: [Họ] [Đệm...] [Tên]
      // Ví dụ: "Nguyễn Văn An" -> "NA", "Lê Thị Thu Hương" -> "LH"
      const firstName = names[0]; // Họ
      const lastName = names[names.length - 1]; // Tên
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }
  }
  /**
   * Tạo màu nền dựa trên tên để có sự đa dạng và nhất quán
   */
  getBackgroundColor(): string {
    if (!this.fullName || this.fullName.trim() === '') {
      return '#6b7280'; // Gray mặc định
    }

    // Bộ màu được chọn kỹ lưỡng để đảm bảo tính thẩm mỹ và contrast tốt với chữ trắng
    const colors = [
      '#e11d48', // Rose-600
      '#dc2626', // Red-600  
      '#ea580c', // Orange-600
      '#d97706', // Amber-600
      '#ca8a04', // Yellow-600
      '#65a30d', // Lime-600
      '#16a34a', // Green-600
      '#059669', // Emerald-600
      '#0d9488', // Teal-600
      '#0891b2', // Cyan-600
      '#0284c7', // Sky-600
      '#2563eb', // Blue-600
      '#4f46e5', // Indigo-600
      '#7c3aed', // Violet-600
      '#9333ea', // Purple-600
      '#c026d3', // Fuchsia-600
      '#db2777', // Pink-600
    ];

    // Tạo hash từ tên để chọn màu consistent
    let hash = 0;
    const name = this.fullName.toLowerCase().trim();
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Đảm bảo hash dương và chọn màu
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  }

  /**
   * Lấy class CSS cho kích thước
   */
  getSizeClass(): string {
    const sizeClasses = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-12 h-12 text-base',
      lg: 'w-16 h-16 text-lg',
      xl: 'w-24 h-24 text-xl'
    };
    
    return sizeClasses[this.size];
  }

  /**
   * Xử lý click vào avatar
   */
  onAvatarClick(): void {
    if (this.isClickable) {
      this.avatarClick.emit();
    }
  }

  /**
   * Xử lý click vào nút edit
   */
  onEditClick(event: Event): void {
    event.stopPropagation();
    this.editClick.emit();
  }

  /**
   * Xử lý lỗi khi load ảnh
   */
  onImageError(): void {
    this.imageUrl = null;
  }
}
