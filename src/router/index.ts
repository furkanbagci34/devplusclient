import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useConfigStore } from "@/stores/config";
import { useAuthStore } from "@/stores/auth";
import DevPlusApiService from "@/core/services/ApiServiceDevPlus";
import JwtService from "@/core/services/JwtService";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Ana Sayfa",
          breadcrumbs: ["Dashboards"],
        },
      },
      {
        path: "/users",
        name: "users",
        component: () => import("@/views/users.vue"),
        meta: {
          pageTitle: "Kullanıcılar",
          breadcrumbs: ["Kullanıcılar"],
          requiresAuth: true,
          roles: ['admin']
        },
      },
      {
        path: "/userAdd",
        name: "userAdd",
        component: () => import("@/views/userAdd.vue"),
        meta: {
          pageTitle: "Kullanıcı Ekle",
          breadcrumbs: ["Kullanıcı Ekle"],
          requiresAuth: true,
          roles: ['admin']
        },
      },
      {
        path: "/vehicleAdd",
        name: "vehicleAdd",
        component: () => import("@/views/vehicleAdd.vue"),
        meta: {
          pageTitle: "Araç Tanımla",
          breadcrumbs: ["Araç Tanımla"],
          requiresAuth: true,
          roles: ['admin']
        },
      },
      {
        path: "/myVehicle",
        name: "myVehicle",
        component: () => import("@/views/myVehicle.vue"),
        meta: {
          pageTitle: "Araç Tanımla",
          breadcrumbs: ["Araç Tanımla"],
          requiresAuth: true,
          roles: ['admin']
        },
      },
      {
        path: "/operation",
        name: "operation",
        component: () => import("@/views/operation.vue"),
        meta: {
          pageTitle: "Operasyon",
          breadcrumbs: ["Operasyon"],
          requiresAuth: true,
          roles: ['admin']
        },
      }
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/authentication/login/SignIn.vue"),
        meta: {
          pageTitle: "Giriş Yap",
        },
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/authentication/login/SignUp.vue"),
        meta: {
          pageTitle: "Kayıt Ol",
        },
      }
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        path: "/404",
        name: "404",
        component: () => import("@/views/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const configStore = useConfigStore();
  const authStore = useAuthStore();
  const ApiService = new DevPlusApiService();

  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  configStore.resetLayoutConfig();

  if(!authStore.getUser){
    if (to.meta.middleware == "auth") {
      const userInfo = await ApiService.Post("login/verifyToken", {accessToken: JwtService.getToken()});
      if(!userInfo.success){
        next({ name: 'sign-in' })
      }
      authStore.setUser({
        name: userInfo.body.userInfo.name,
        surname: userInfo.body.userInfo.surname,
        email: userInfo.body.userInfo.email,
        phone: userInfo.body.userInfo.mobile_phone,
        role: userInfo.body.userInfo.role.role[0],
        isAuth: userInfo.body.isAuth
      })
      next();
    } else {
      next();
    }
  } else if (to.meta.middleware == "auth") {
    if (!authStore?.getUser?.isAuth) {
      next({ name: 'sign-in' })
    } else if (to.meta.requiresAuth && to.meta.roles && to.meta.roles.indexOf(authStore.getUser.role) === -1) {
      next({ name: 'home' })
    } else {
      next()
    }
  } else {
    next();
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

export default router;
