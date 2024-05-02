import PropTypes from "prop-types";
import { Navigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import { isUserLoggedIn } from "src/utils/auth";

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  if (isUserLoggedIn()) {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }

  return <> {children} </>;
}
