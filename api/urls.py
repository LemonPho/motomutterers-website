from django.contrib import admin
from django.urls import path, include

from .views.users_view import user_view

from .views.seasons_view import seasons_view

from .views.announcements_view import announcements_view

from .views.competitors_view import competitors_view

from .views.comments_view import comments_view

from .views.standings_view import standings_view

from .views import activation_view, authentication_view, utils_view, notification_view
from .views.picks_view import picks_view
from .views.standings_view import standings_view
from .views.races_view import races_view

urlpatterns = [
    #get
    path('find-account', utils_view.find_account),
    path('find-image', utils_view.find_image),
    path('get-announcements', announcements_view.get_announcements),
    path('get-comments', comments_view.get_comments),
    path('get-competitor-position', competitors_view.get_competitor_position),
    path('get-season-competitor', competitors_view.get_season_competitor),
    path('get-competitors/', competitors_view.get_all_competitors),
    path('get-current-season/', seasons_view.get_current_season),
    path('get-current-user/', user_view.get_current_user),
    path('get-logged-in/', user_view.get_logged_in),
    path('get-notifications/', notification_view.get_notifications),
    path('get-race', races_view.get_race),
    path('get-race-comments', races_view.get_race_comments),
    path('get-race-results', races_view.get_season_races),
    path('get-season', seasons_view.get_season),
    path('get-season-simple', seasons_view.get_season_simple),
    path('get-seasons-simple/', seasons_view.get_seasons_simple),
    path('get-seasons-simple-year/', seasons_view.get_seasons_simple_year),
    path('get-season-competitors', competitors_view.get_season_competitors),
    path('get-season-races', races_view.get_season_races),
    path('get-standings', standings_view.get_standings),
    path('get-token/', utils_view.get_token),
    path('get-user-comments', user_view.get_user_comments),
    path('get-user/', user_view.get_user),
    path('get-profile-picture', user_view.get_profile_picture),
    path('get-default-pfp/', user_view.get_default_profile_picture),
    path('get-user-picks', picks_view.get_user_picks),
    path('get-user-picks-simple', picks_view.get_user_picks_simple),
    path('get-users-picks-state/', seasons_view.get_users_picks_state),

    #post
    path('add-race-results/', races_view.add_race_results),
    path('change-email/', user_view.change_email),
    path('change-password/', user_view.change_password),
    path('change-profile-picture/', user_view.change_profile_picture),
    path('change-username/', user_view.change_username),
    path('create-competitor/', competitors_view.create_competitor),
    path('create-season-competitors-link/', competitors_view.create_season_competitors_link),
    path('create-season/', seasons_view.create_season),
    path('create-race/', races_view.create_race),
    path('create-complete-race/', races_view.create_complete_race),
    path('create-race-link/', races_view.create_race_link),
    path('delete-account/', user_view.delete_account),
    path('delete-announcement/', announcements_view.delete_announcement),
    path('delete-all-competitors/', competitors_view.delete_all_competitors),
    path('delete-comment/', comments_view.delete_comment),
    path('delete-competitor/', competitors_view.delete_competitor),
    path('delete-competitors/', competitors_view.delete_competitors),
    path('delete-race/', races_view.delete_race),
    path('delete-season/', seasons_view.delete_season),
    path('edit-announcement/', announcements_view.edit_announcement),
    path('edit-season-competitor/', competitors_view.edit_season_competitor),
    path('edit-race/', races_view.edit_race),
    path('edit-comment/', comments_view.edit_comment),
    path('post-comment/', comments_view.post_comment),
    path('read-notification/', notification_view.read_notification),
    path('register/', authentication_view.register),
    path('reset-password/', user_view.reset_password),
    path('retrieve-race-result/', races_view.retrieve_race_result),
    path('set-current-season/', seasons_view.set_current_season),
    path('set-user-picks/', picks_view.set_user_picks),
    path('finalize-season/', seasons_view.finalize_season),
    path('toggle-users-picks/', seasons_view.toggle_users_picks),

    #other
    path('request-activation-token/', activation_view.request_activation_token),
    path('activate', activation_view.activate_account),
    path('activate-email', activation_view.activate_email),
    path('login/', authentication_view.login_view),
    path('logout/', authentication_view.logout_view),
    path('send-reset-email', user_view.email_new_password),   
]