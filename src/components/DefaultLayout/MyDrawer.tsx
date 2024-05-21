import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Avatar, Badge, Menu, MenuItem, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { NotificationCard } from "../NotificationCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppStoreState } from "../../store/store";
import { setSelectedPage } from "../../modules/app/slice";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface Props {
  children?: any;
}

const SideMenuBarList = [
  {
    index: 0,
    title: "Dashboard",
    icon: "/icons/dashboardIcon.svg",
    activeIcon: "/icons/dashboardIconActive.svg",
    url: "/",
    meta_name: []
  },
  {
    index: 1,
    title: "Manage staff",
    icon: "/icons/manageAdminIcon.svg",
    activeIcon: "/icons/manageAdminsActive.svg",
    url: "/staff",
    meta_name: ['manage_employees']
  },
  {
    index: 2,
    title: "Manage machines",
    icon: "/icons/machine-icon.svg",
    activeIcon: "/icons/macineActiveIcon.svg",
    url: "/machines",
    meta_name: ['manage_machines']
  },
  {
    index: 3,
    title: "Today's Schedule",
    icon: "/icons/manageSubscriptionIcon.svg",
    activeIcon: "/icons/scheduleActive.svg",
    url: "/today-schedule",
    meta_name: ['manage_maintenance']
  },
  {
    index: 4,
    title: "Upcoming Schedule",
    icon: "/icons/upcoming-schedule.svg",
    activeIcon: "/icons/upcomingScheduleActive.svg",
    url: "/upcoming-schedule",
    meta_name: ['manage_maintenance']
  },
  {
    index: 5,
    title: "Manage inventory",
    icon: "/icons/inventory-icon.svg",
    activeIcon: "/icons/inventoryActive.svg",
    url: "/inventory",
    meta_name: ['manage_inventory']
  },
  {
    index: 6,
    title: "Invoices",
    icon: "/icons/invoice-icon.svg",
    activeIcon: "/icons/invoice-icon copy.svg",
    url: "/invoices",
    meta_name: ['manage_machines']
  },
  // {
  //   index: 7,
  //   title: "Report",
  //   icon: "/icons/reportIcon.svg",
  //   activeIcon: "/icons/reportIcon.svg",
  //   url: "/report",
  //   meta_name:'manage_reports'
  // },
];

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const PersistentDrawerLeft: React.FC<Props> = (props) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const { children } = props;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPage, user } = useSelector((state: AppStoreState) => state.app);
  console.log(user, "user");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const constantItems = ['Dashboard'];

  const filteredMenuItems = SideMenuBarList.filter(item1 => {
    // Check if the item's title is in the constantItems array
    if (constantItems.includes(item1.title)) {
      return true; // Include the item in the filtered array
    }
    return user?.permissions?.some((item2: any) => item1?.meta_name?.includes(item2.meta_name));
  });



  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            borderRight: "none",
            backgroundColor: "#373737",
          },
        }}
        open={open}
      >
        <DrawerHeader
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: open ? "20px 10px 10px 20px" : "10px 0px 0px 10px",
          }}
        >
          {open ? (
            <>
              <Avatar
                src="/images/full-logo.svg"
                variant="square"
                sx={{ width: "60%", height: "auto" }}
              />
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerClose}
              >
                <Avatar
                  src="/images/openDrrawerIcon.svg"
                  variant="square"
                  sx={{ width: "100%", height: "auto" }}
                />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={handleDrawerOpen}>
              <Avatar
                variant="square"
                src="/images/logo.svg"
                sx={{ width: "95%" }}
              />
            </IconButton>
          )}
        </DrawerHeader>

        <List>

          {/* <ListItem disablePadding
            // className={router.pathname == "/" ? "navlink-gradient" : ""}
            sx={{
              display: "block",
              backgroundColor: router.pathname == "/" ? "#FBCC2533" : "transparent",
              "&:hover": {
                backgroundColor: "#FBCC2533",
                color: "#006699",
              },
              mb: 2,
            }}
          >
            <ListItemButton disableRipple
              sx={{ justifyContent: open ? "initial" : "center", px: 3, }}
              onClick={() => { router.push("/"); }}
            >
              <Avatar variant="square" sx={{
                height: "auto", minWidth: 0, maxWidth: 20, mr: open ? 3 : "auto", justifyContent: "center",
              }}
                src={router.pathname == "/" ? "/icons/dashboardIconActive.svg" : "/icons/dashboardIcon.svg"}
              />
              <ListItemText
                primary={"Dashboard"}
                primaryTypographyProps={{
                  fontSize: "14px", fontWeight: router.pathname == "/" ? 700 : 400,
                  color: router.pathname == "/" ? "#FFD12E" : "#FFFFFF",
                }}
                sx={{
                  opacity: open ? 1 : 0,
                }}
              />
            </ListItemButton>
          </ListItem> */}

          {filteredMenuItems?.map((e, index) => (
            <ListItem key={index} disablePadding
              className={e.url === router.pathname || e.title === selectedPage ? "navlink-gradient" : ""}
              sx={{
                display: "block",
                backgroundColor:
                  e.url === router.pathname ? "#FBCC2533" : "transparent",
                "&:hover": {
                  backgroundColor: "#FBCC2533",
                  color: "#006699",
                },
                mb: 2,
              }}
            >
              <ListItemButton
                disableRipple
                sx={{
                  justifyContent: open ? "initial" : "center",
                  px: 3,
                }}
                onClick={() => {
                  router.push(e.url);
                  dispatch(setSelectedPage({ selectedPage: e.title, }));
                }}
              >
                <Avatar
                  variant="square"
                  sx={{
                    height: "auto",
                    minWidth: 0,
                    maxWidth: 20,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                  src={
                    e.url === router.pathname || e.title === selectedPage
                      ? e.activeIcon
                      : e.icon
                  }
                />
                <ListItemText
                  primary={e.title}
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight:
                      e.url === router.pathname || e.title === selectedPage
                        ? 700
                        : 400,
                    color:
                      e.url === router.pathname || e.title === selectedPage
                        ? "#FFD12E"
                        : "#FFFFFF",
                  }}
                  sx={{
                    opacity: open ? 1 : 0,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          {/* {
            user?.permissions?.meta_name == 'manage_employees' || user?.permissions?.meta_name == 'manage_machines' ?
              <ListItem disablePadding
                // className={router.pathname == "/" ? "navlink-gradient" : ""}
                sx={{
                  display: "block",
                  backgroundColor: router.pathname == "/invoices" ? "#FBCC2533" : "transparent",
                  "&:hover": {
                    backgroundColor: "#FBCC2533",
                    color: "#006699",
                  },
                  mb: 2,
                }}
              >
                <ListItemButton disableRipple
                  sx={{ justifyContent: open ? "initial" : "center", px: 3, }}
                  onClick={() => { router.push("/invoices"); }}
                >
                  <Avatar variant="square" sx={{
                    height: "auto", minWidth: 0, maxWidth: 20, mr: open ? 3 : "auto", justifyContent: "center",
                  }}
                    src={router.pathname == "/invoices" ? "/icons/invoice-icon copy.svg" : "/icons/invoice-icon.svg"}
                  />
                  <ListItemText
                    primary={"Invoices"}
                    primaryTypographyProps={{
                      fontSize: "14px", fontWeight: router.pathname == "/invoices" ? 700 : 400,
                      color: router.pathname == "/invoices" ? "#FFD12E" : "#FFFFFF",
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                    }}
                  />
                </ListItemButton>
              </ListItem> : ""

          } */}

        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "1.5%",
            p: 3,
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "16px" }}>
            {user?.customer.name}
          </Typography>
          <Box
            sx={{
              // width: "15%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* <Badge
              color="error"
              variant="dot"
              sx={{ width: "10%", height: "10%" }}
            >
              <Avatar
                src="/icons/Notification.svg"
                variant="square"
                alt="notificaiton"
                sx={{ width: "100%", height: "auto" }}
              />
            </Badge>
            <Typography
              sx={{ fontWeight: 600, fontSize: "16px", cursor: "pointer", ml: 1 }}
              onClick={handleClick}
            >
              {"Notifications"}
            </Typography>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={openMenu}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem
                onClick={handleClose}
                sx={{ borderBottom: "solid 1px #CDCDCD" }}
              >
                <NotificationCard
                  image="/icons/ArrowCircleDown.svg"
                  title="Item request accepted"
                  date="11.10.2023 , 11:10AM"
                />
              </MenuItem>
              <MenuItem
                onClick={handleClose}
                sx={{ borderBottom: "solid 1px #CDCDCD" }}
              >
                <NotificationCard
                  image="/icons/ArrowCircleUp.svg"
                  title="Return request accepted"
                  date="11.10.2023 , 11:10AM"
                />
              </MenuItem>
              <MenuItem
                onClick={handleClose}
                sx={{ borderBottom: "solid 1px #CDCDCD" }}
              >
                <NotificationCard
                  image="/icons/ArrowCircleDown.svg"
                  title="Item request Rejected"
                  date="11.10.2023 , 11:10AM"
                />
              </MenuItem>
              <MenuItem
                onClick={handleClose}
                sx={{ borderBottom: "solid 1px #CDCDCD" }}
              >
                <NotificationCard
                  image="/icons/overDueIcon.svg"
                  title="Job HSR874378 Overdue"
                  date="11.10.2023 , 11:10AM"
                />
              </MenuItem>
            </Menu> */}

            <Avatar variant="square" sx={{
              width: "35px", height: "35px", borderRadius: "5px", cursor: "pointer", ml: 1
            }} onClick={() => { router.push("/my-profile"); }} src={user?.customer?.logo}>{user?.name?.charAt(0)}</Avatar>
          </Box>
        </Box>
        {children}
      </Box>
    </Box>
  );
};

export default PersistentDrawerLeft;
