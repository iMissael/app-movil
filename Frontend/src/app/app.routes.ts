import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) 
  },
  
  // Layout para STUDENT
  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'student' },
    loadComponent: () => import('./components/layout/student-layout/student-layout.component').then(m => m.StudentLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./components/student/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      { 
        path: 'materias', 
        loadComponent: () => import('./components/student/materias/materias.component').then(m => m.MateriasComponent) 
      },
      { 
        path: 'materia/:id/temas', 
        loadComponent: () => import('./components/student/temas/temas.component').then(m => m.TemasComponent) 
      },
      { 
        path: 'tema/:id/subtemas', 
        loadComponent: () => import('./components/student/subtemas/subtemas.component').then(m => m.SubtemasComponent) 
      },
      { 
        path: 'subtema/:id/contenido', 
        loadComponent: () => import('./components/student/contenido/contenido.component').then(m => m.ContenidoComponent) 
      },
      { 
        path: 'subtema/:id/ejercicios', 
        loadComponent: () => import('./components/student/ejercicios/ejercicios.component').then(m => m.EjerciciosComponent) 
      },
    ]
  },

  // Layout para ADMIN
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' },
    loadComponent: () => import('./components/layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./components/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      
      // CRUD Usuarios
      { 
        path: 'usuarios', 
        loadComponent: () => import('./components/admin/usuarios/usuarios.component').then(m => m.UsuariosComponent) 
      },
      
      // CRUD Materias
      { 
        path: 'materias', 
        loadComponent: () => import('./components/admin/materias/materias.component').then(m => m.MateriasComponent) 
      },
      
      // CRUD Temas
      { 
        path: 'materia/:materiaId/temas', 
        loadComponent: () => import('./components/admin/temas/temas.component').then(m => m.TemasComponent) 
      },
      
      // CRUD Subtemas
      { 
        path: 'tema/:temaId/subtemas', 
        loadComponent: () => import('./components/admin/subtemas/subtemas.component').then(m => m.SubtemasComponent) 
      },
      
      // CRUD Contenidos
      { 
        path: 'subtema/:subtemaId/contenidos', 
        loadComponent: () => import('./components/admin/contenidos/contenidos.component').then(m => m.ContenidosComponent) 
      },
      
      // CRUD Ejercicios
      { 
        path: 'subtema/:subtemaId/ejercicios', 
        loadComponent: () => import('./components/admin/ejercicios/ejercicios.component').then(m => m.EjerciciosComponent) 
      },
    ]
    
  },
  
  { path: '**', redirectTo: '/login' }
];