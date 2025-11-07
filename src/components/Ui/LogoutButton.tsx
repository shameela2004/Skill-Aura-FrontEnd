// // import { useAuthStore } from "../../stores/useAuthStore";

// // const LogoutButton = () => {
// //   const logout = useAuthStore((state) => state.logout);
// //   return (
// //     <button onClick={logout} className="text-red-600 font-bold">
// //       Logout
// //     </button>
// //   );
// // };




// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace MyApp1.Application.DTOs.Post
// {
//     public class PostDto
//     {
//         public int PostId { get; set; }
//         public int UserId { get; set; }
//         public string UserName { get; set; } = string.Empty;
//         public string Content { get; set; } = string.Empty;
//         public string? MediaUrl { get; set; }
//         public int LikeCount { get; set; }
//         public int CommentCount { get; set; }
//         public DateTime CreatedAt { get; set; }
//     }
// }
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace MyApp1.Application.DTOs.Skill
// {
//     public class AddUserSkillDto
//     {
//         public int SkillId { get; set; }
//         public string Type { get; set; } = string.Empty; // Learn / Teach
//     }

// }
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace MyApp1.Application.DTOs.Skill
// {
//     public class SkillDto
//     {
//         public int Id { get; set; }
//         public string Name { get; set; } = string.Empty;
//     }
// }
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace MyApp1.Application.DTOs.Skill
// {
//     public class SkillResponseDto
//     {
//         public int Id { get; set; }
//         public string Name { get; set; } = string.Empty;
//     }

// }
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace MyApp1.Application.DTOs.Skill
// {
//     public class UserSkillDto
//     {
//         public int SkillId { get; set; }
//         public string SkillName { get; set; } = string.Empty;
//         public string Type { get; set; } = string.Empty;  // Learn / Teach
//     }

// }
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace MyApp1.Application.DTOs.Skill
// {
//     public class UserSkillResponseDto
//     {
//         public int SkillId { get; set; }
//         public string SkillName { get; set; } = string.Empty;
//         public string Type { get; set; } = string.Empty; // Learn / Teach
//     }
// }
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace MyApp1.Application.DTOs.User
// {
//     public class UpdateUserDto
//     {
//         public string Name { get; set; } = string.Empty;
//         public string? Bio { get; set; }
//         public string? Location { get; set; }
//         public string? ProfilePictureUrl { get; set; }
//     }
// }
// using MyApp1.Application.DTOs.Language;
// using MyApp1.Application.DTOs.Mentor;
// using MyApp1.Application.DTOs.Skill;
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace MyApp1.Application.DTOs.User
// {
//     public class UserDto
//     {
//         //public int Id { get; set; }
//         public string Name { get; set; } = string.Empty;
//         public string? Bio { get; set; }
//         public string? Location { get; set; }
//         public string? ProfilePictureUrl { get; set; }
//         public ICollection<UserSkillDto>? Skills { get; set; }
//         public ICollection<UserLanguageDto>? Languages { get; set; }
//         public ICollection<UserBadgeDto>? Badges { get; set; }

//         public List<MentorAvailabilityDto>? MentorAvailabilities { get; set; }
//     }
// }
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace MyApp1.Application.DTOs.Mentor
// {
//     public class MentorAvailabilityDto
//     {
//         public DayOfWeek DayOfWeek { get; set; }
//         public TimeSpan StartTime { get; set; }
//         public TimeSpan EndTime { get; set; }
//     }
// }
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace MyApp1.Application.DTOs.Language
// {
//     public class AddUserLanguageDto
//     {
//         public int LanguageId { get; set; }
//         public string? Proficiency { get; set; }
//     }

// }
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace MyApp1.Application.DTOs.Language
// {
//     public class LanguageDto
//     {
//         public int Id { get; set; }
//         public string Code { get; set; } = string.Empty;
//         public string Name { get; set; } = string.Empty;
//     }

// }
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace MyApp1.Application.DTOs.Language
// {
//     public class LanguageResponseDto
//     {
//         public int Id { get; set; }
//         public string Code { get; set; } = string.Empty;
//         public string Name { get; set; } = string.Empty;
//     }
// }
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace MyApp1.Application.DTOs.Language
// {
//     public class UserLanguageDto
//     {
//         public int LanguageId { get; set; }
//         public string LanguageName { get; set; } = string.Empty;
//         public string? Proficiency { get; set; }
//     }

// }
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace MyApp1.Application.DTOs.Language
// {
//     public class UserLanguageResponseDto
//     {
//         public int LanguageId { get; set; }
//         public string LanguageName { get; set; } = string.Empty;
//         public string? Proficiency { get; set; }
//     }
// }.. i dont have any reuable compoent i need also the language mangement also okay 