// Pager
const paginationForDetailTeamSquad = new MDPager('team-squad-section', 15, 45, 1);
paginationForDetailTeamSquad.generatePageSelector(10, 2, 'current-page', () => {alert('a')});

// Pager
const paginationForDetailTeamMembers = new MDPager('team-members-pager', 15, 45, 1);
paginationForDetailTeamMembers.generatePageSelector(10, 2, 'current-page', () => {alert('a')});