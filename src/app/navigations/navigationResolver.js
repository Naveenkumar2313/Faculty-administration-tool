// ─── navigationResolver.js ────────────────────────────────────────────────────
// Single source of truth: given a user role, return the correct navigation array.
// Used by HierarchicalSidenav so the sidebar always matches the logged-in role.

import { superAdminNavigations }   from './superAdminNavigations';
import { navigations }             from './navigations';          // faculty
import { hostelAdminNavigations }  from './hostelAdminNavigations';
import { transportAdminNavigations }from './transportAdminNavigations';
import { driverNavigations }       from './driverNavigations';
import { studentNavigations }      from './studentNavigations';
import { maintenanceNavigations }  from './maintenanceNavigations';

// Map role string → navigation array
const NAV_MAP = {
  superAdmin:     superAdminNavigations,
  faculty:        navigations,
  hostelAdmin:    hostelAdminNavigations,
  transportAdmin: transportAdminNavigations,
  driver:         driverNavigations,
  student:        studentNavigations,
  maintenance:    maintenanceNavigations
};

/**
 * Returns the navigation array for the given role.
 * Falls back to faculty navigations if role is unknown.
 * @param {string} role  – user.role from AuthContext
 * @returns {Array}
 */
export function getNavigationsByRole(role) {
  return NAV_MAP[role] ?? navigations;
}

export default NAV_MAP;
