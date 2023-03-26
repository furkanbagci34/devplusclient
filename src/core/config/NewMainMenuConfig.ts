export interface MenuItem {
  heading?: string;
  sectionTitle?: string;
  route?: string;
  pages?: Array<MenuItem>;
  svgIcon?: string;
  fontIcon?: string;
  sub?: Array<MenuItem>;
  roles?: string[];
}

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "Ana Sayfa",
        route: "/home",
        fontIcon: "bi-house",
        roles: ["admin"]
      },
      {
        heading: "Kullanıcılar",
        route: "/users",
        fontIcon: "bi-person-fill",
        roles: ["admin"]
      },
      {
        heading: "Kullanıcı Ekle",
        route: "/userAdd",
        fontIcon: "bi-person-fill-add",
        roles: ["admin"]
      },
      {
        heading: "Araç Tanımla",
        route: "/vehicleAdd",
        fontIcon: "bi-car-front-fill",
        roles: ["admin"]
      },
      {
        heading: "Araçlarım",
        route: "/myVehicle",
        fontIcon: "bi-car-front-fill",
        roles: ["admin","user"]
      },
      {
        heading: "Operasyon",
        route: "/operation",
        fontIcon: "bi-hypnotize",
        roles: ["admin"]
      },
      {
        heading: "Çıkış",
        route: "/sign-in",
        fontIcon: "bi-arrow-bar-right",
        roles: ["admin"]
      },
    ],
  },
];

export default MainMenuConfig;
