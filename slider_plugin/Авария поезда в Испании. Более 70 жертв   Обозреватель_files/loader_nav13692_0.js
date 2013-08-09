var navMap = {'<void>':['al_index.php',['index.css','index.js']],'<other>':['al_profile.php',['profile.css','page.css','profile.js','page.js']],'public\\d+($|/)':['al_public.php',['public.css','page.css','public.js','page.js']],'event\\d+($|/)':['al_events.php',['groups.css','page.css','groups.js','page.js']],'club\\d+($|/)':['al_groups.php',['groups.css','page.css','groups.js','page.js']],'publics\\d+($|/)':['al_public.php',['public.css','page.css','public.js','page.js']],'groups(\\d+)?$':['al_groups.php',['groups.css','groups_list.js','indexer.js']],'events$':['al_events.php',['events.css','page.css','events.js','page.js']],'changemail$':['register.php',['reg.css']],'mail($|/)':['al_mail.php',['mail.css','mail.js']],'write\\d*($|/)':['al_mail.php',['mail.css','mail.js']],'im($|/)':['al_im.php',['im.css','im.js']],'audio-?\\d+_\\d+$':['al_audio.php',['audio.css','audio.js']],'audios(-?\\d+)?$':['al_audio.php',['audio.css','audio.js']],'audio($|/)':['al_audio.php',['audio.css','audio.js']],'apps_check($|/)':['al_apps_check.php',['apps.css','apps.js']],'apps($|/)':['al_apps.php',['apps.css','apps.js']],'editapp($|/)':['al_apps_edit.php',['apps.css','apps.js']],'regstep\\d$':['register.php',['reg.js','reg.css','ui_controls.js','ui_controls.css','selects.js']],'video(-?\\d+_\\d+)?$':['al_video.php',['video.js','video.css','videoview.js','videoview.css','indexer.js']],'videos(-?\\d+)?$':['al_video.php',['video.js','video.css','indexer.js']],'feed$':['al_feed.php',['page.css','page.js','feed.css','feed.js']],'friends$':['al_friends.php',['friends.js','friends.css','privacy.css']],'friendsphotos$':['al_photos.php',['friendsphotos.js','photoview.js','friendsphotos.css','photoview.css']],'wall-?\\d+(_\\d+)?$':['al_wall.php',['page.js','page.css','wall.js','wall.css']],'tag\\d+$':['al_photos.php',['photos.js','photoview.js','photos.css','photoview.css']],'albums(-?\\d+)?$':['al_photos.php',['photos.js','photos.css']],'photos(-?\\d+)?$':['al_photos.php',['photos.js','photos.css']],'album-?\\d+_\\d+$':['al_photos.php',['photos.js','photos.css']],'photo-?\\d+_\\d+$':['al_photos.php',['photos.js','photos.css','photoview.js','photoview.css']],'search$':['al_search.php',['search.css','search.js']],'people($|/)':['al_search.php',['search.css','search.js']],'communities$':['al_search.php',['search.css','search.js']],'brands$':['al_search.php',['search.css','search.js']],'invite$':['invite.php',['invite.css','invite.js','ui_controls.css','ui_controls.js']],'join$':['join.php',['join.css','join.js']],'settings$':['al_settings.php',['settings.js','settings.css']],'edit$':['al_profileEdit.php',['profile_edit.js','profile_edit.css']],'blog$':['blog.php',['blog.css']],'fave$':['al_fave.php',['fave.js','fave.css','page.css','wall.css','qsorter.js','indexer.js']],'topic$':['al_board.php',['board.css']],'board\\d+$':['al_board.php',['board.css','board.js']],'topic-?\\d+_\\d+$':['al_board.php',['board.css','board.js']],'stats($|/)':['al_stats.php',['stats.css']],'ru/(.*)?$':['al_pages.php',['pages.css','pages.js','wk.css','wk.js']],'pages($|/)':['al_pages.php',['pages.css','pages.js','wk.css','wk.js']],'page-?\\d+_\\d+$':['al_pages.php',['pages.css','pages.js','wk.css','wk.js']],'restore($|/)':['al_restore.php',['restore.js','restore.css']],'recover($|/)':['recover.php',['recover.js','recover.css']],'gifts\\d*$':['al_gifts.php',['gifts.js','gifts.css']],'docs($|/)':['docs.php',['docs.css','docs.js','indexer.js']],'doc-?\\d+_\\d+$':['docs.php',['docs.css','docs.js','indexer.js']],'docs-?\\d+$':['docs.php',['docs.css','docs.js','indexer.js']],'login($|/)':['al_login.php',['login.css']],'tasks($|/)':['tasks.php',['tasks.css','tasks.js']],'abuse($|/)':['abuse.php',['abuse.css','abuse.js']],'support($|/)':['al_tickets.php',['tickets.css','tickets.js']],'helpdesk($|/)':['al_helpdesk.php',['tickets.css','tickets.js']],'offersdesk($|/)':['offers.php',['offers.css','offers.js']],'payments($|/)':['al_payments.php',['payments.css']],'faq($|/)':['al_faq.php',['faq.css','faq.js']],'tlmd($|/)':['al_talmud.php',['faq.js','faq.css','tickets.css','tickets.js']],'sms_office($|/)':['sms_office.php',['sms_office.css','sms_office.js']],'dev($|/)':['dev.php',['dev.css','dev.js']],'developers($|/)':['al_developers.php',['developers.css']],'help($|/)':['al_help.php',['help.css','help.js']],'claims($|/)':['al_claims.php',['claims.css','claims.js']],'ads$':['ads.php',['ads.css','ads.js']],'adbonus$':['ads.php',['ads.css','ads.js']],'adsbonus$':['ads.php',['ads.css','ads.js']],'adregister$':['ads.php',['ads.css','ads.js']],'adsedit$':['ads_edit.php',['ads.css','ads.js','ads_edit.css','ads_edit.js']],'adscreate$':['ads_edit.php',['ads.css','ads.js','ads_edit.css','ads_edit.js']],'adsmoder$':['ads_moder.php',['ads.css','ads.js','ads_moder.css','ads_moder.js']],'adsweb$':['ads_web.php',['ads.css','ads.js','ads_web.css','ads_web.js']],'test$':['al_help.php',['help.css','help.js']],'agenttest$':['al_help.php',['help.css','help.js']],'grouptest$':['al_help.php',['help.css','help.js']],'dmca$':['al_tickets.php',['tickets.css','tickets.js']],'terms$':['al_help.php',['help.css','help.js']],'privacy$':['al_help.php',['help.css','help.js']],'editdb$':['editdb.php',['editdb.css','editdb.js']],'note\\d+_\\d+$':['al_wall.php',['wall.js','wall.css','wk.js','wk.css','pagination.js']],'notes(\\d+)?$':['al_wall.php',['wall.js','wall.css','wk.js','wk.css','pagination.js']],'bugs($|/)':['bugs.php',['bugs.css','bugs.js']],'wkview.php($)':['wkview.php',['wkview.js','wkview.css','wk.js','wk.css']],'stickers_office($|/)':['stickers_office.php',['stickers_office.css','stickers_office.js']],'charts($|/)':['al_audio.php',['audio.css','audio.js']]}; var stVersions = { 'nav': 13692, 'common.js': 1095, 'common.css': 412, 'pads.js': 55, 'pads.css': 59, 'retina.css': 152, 'uncommon.js': 9, 'uncommon.css': 61, 'filebutton.css': 9, 'filebutton.js': 9, 'lite.js': 76, 'lite.css': 24, 'ie6.css': 26, 'ie7.css': 18, 'rtl.css': 144, 'pagination.js': 18, 'blog.css': 7, 'html5audio.js': 5, 'html5video.js': 29, 'html5video.css': 10, 'audioplayer.js': 114, 'audioplayer.css': 15, 'audio_html5.js': 7, 'audio.js': 200, 'audio.css': 115, 'gifts.css': 37, 'gifts.js': 34, 'indexer.js': 19, 'graph.js': 32, 'graph.css': 1, 'boxes.css': 22, 'box.js': 5, 'rate.css': 4, 'tooltips.js': 68, 'tooltips.css': 77, 'sorter.js': 19, 'qsorter.js': 22, 'usorter.js': 2, 'phototag.js': 5, 'phototag.css': 2, 'photoview.js': 322, 'photoview.css': 164, 'friendsphotos.js': 13, 'friendsphotos.css': 17, 'friends.js': 191, 'friends.css': 132, 'friends_search.js': 11, 'friends_search.css': 6, 'board.js': 67, 'board.css': 47, 'photos.css': 76, 'photos.js': 70, 'photos_add.css': 17, 'photos_add.js': 36, 'wkpoll.js': 13, 'wkview.js': 112, 'wkview.css': 88, 'single_pv.css': 9, 'single_pv.js': 4, 'video.js': 124, 'video.css': 106, 'videoview.js': 194, 'videoview.css': 117, 'video_edit.js': 17, 'video_edit.css': 16, 'translation.js': 13, 'translation.css': 5, 'reg.css': 26, 'reg.js': 56, 'invite.css': 11, 'invite.js': 10, 'prereg.js': 14, 'index.css': 22, 'index.js': 29, 'join.css': 61, 'join.js': 89, 'intro.css': 21, 'owner_photo.js': 23, 'owner_photo.css': 12, 'page.js': 766, 'page.css': 614, 'about.css': 1, 'page_fixed.css': 21, 'page_help.css': 15, 'public.css': 56, 'public.js': 41, 'events.css': 32, 'events.js': 37, 'pages.css': 47, 'pages.js': 40, 'groups.css': 86, 'groups.js': 31, 'groups_list.js': 50, 'groups_edit.css': 41, 'groups_edit.js': 65, 'profile.css': 199, 'profile.js': 203, 'calendar.css': 5, 'calendar.js': 13, 'wk.css': 34, 'wk.js': 13, 'pay.css': 3, 'pay.js': 6, 'tagger.js': 13, 'tagger.css': 13, 'qsearch.js': 11, 'wall.css': 70, 'wall.js': 70, 'walledit.js': 48, 'thumbs_edit.css': 6, 'thumbs_edit.js': 17, 'mail.css': 73, 'mail.js': 88, 'email.css': 2, 'im.css': 237, 'im.js': 149, 'wide_dd.css': 12, 'wide_dd.js': 25, 'writebox.css': 5, 'writebox.js': 27, 'sharebox.js': 8, 'fansbox.js': 28, 'feed.js': 339, 'feed.css': 196, 'privacy.js': 85, 'privacy.css': 49, 'apps.css': 145, 'apps.js': 215, 'apps_edit.js': 83, 'apps_edit.css': 78, 'apps_check.js': 21, 'apps_check.css': 20, 'settings.js': 79, 'settings.css': 62, 'profile_edit.js': 68, 'profile_edit.css': 31, 'profile_edit_edu.js': 3, 'profile_edit_job.js': 1, 'profile_edit_mil.js': 1, 'search.js': 101, 'search.css': 74, 'datepicker.js': 25, 'datepicker.css': 10, 'oauth_popup.css': 26, 'oauth_page.css': 12, 'oauth_touch.css': 3, 'notes.css': 18, 'notes.js': 30, 'wysiwyg.js': 46, 'wysiwyg.css': 33, 'wiki.css': 9, 'fave.js': 47, 'fave.css': 47, 'widget_comments.css': 71, 'widget_community.css': 58, 'api/widgets/al_comments.js': 99, 'api/widgets/al_poll.js': 6, 'api/widgets/al_community.js': 51, 'api/widgets/al_like.js': 18, 'al_poll.css': 3, 'widget_recommended.css': 3, 'widgets.css': 10, 'developers.css': 6, 'touch.css': 7, 'notifier.js': 227, 'notifier.css': 70, 'restore.js': 18, 'restore.css': 11, 'recover.js': 1, 'recover.css': 3, 'docs.js': 57, 'docs.css': 60, 'tags_dd.js': 17, 'tags_dd.css': 14, 'tasks.js': 23, 'tasks.css': 29, 'tickets.js': 125, 'tickets.css': 104, 'faq.js': 13, 'faq.css': 17, 'bugs.js': 21, 'bugs.css': 17, 'login.css': 37, 'upload.js': 79, 'graffiti.js': 26, 'graffiti.css': 22, 'abuse.js': 14, 'abuse.css': 17, 'verify.css': 6, 'stats.css': 22, 'payments.css': 28, 'payments.js': 6, 'offers.css': 17, 'offers.js': 23, 'call.js': 72, 'call.css': 13, 'aes_light.css': 26, 'aes_light.js': 29, 'ads.css': 42, 'ads.js': 38, 'ads_edit.css': 22, 'ads_edit.js': 77, 'ads_moder.css': 27, 'ads_moder.js': 25, 'ads_tagger.js': 2, 'ads_web.css': 11, 'ads_web.js': 25, 'health.css': 11, 'health.js': 5, 'pinbar.js': 4, 'sms_office.css': 17, 'sms_office.js': 12, 'help.css': 17, 'help.js': 11, 'claims.css': 5, 'claims.js': 4, 'site_stats.css': 8, 'site_stats.js': 5, 'meminfo.css': 9, 'blank.css': 1, 'wk_editor.js': 70, 'wk_editor.css': 28, 'btagger.js': 12, 'btagger.css': 11, 'filters.js': 54, 'dev.js': 48, 'dev.css': 57, 'share.css': 6, 'stickers_office.css': 1, 'stickers_office.js': 1, 'ui_controls.js': 146, 'ui_controls.css': 47, 'selects.js': 23, 'mentions.js': 50, 'apps_flash.js': 64, 'maps.js': 11, 'places.js': 29, 'places.css': 31, 'map2.js': 4, 'map.css': 4, 'sort.js': 8, 'paginated_table.js': 49, 'paginated_table.css': 8, 'q_frame.php': 6, '/swf/api_wrapper.swf': 4, '/swf/api_external.swf': 7, '/swf/api_wrapper2_0.swf': 5, '/swf/queue_transport.swf': 8, '/swf/audio_lite.swf': 12, '/swf/uploader_lite.swf': 8, '/swf/photo_uploader_lite.swf': 11, '/swf/CaptureImg.swf': 9, '/swf/video.swf': 8, '/swf/vkvideochat.swf': 46, '/swf/vchatdevices.swf': 1, 'lang': 6503}; var stTypes = {fromLib:{'md5.js':1,'ui_controls.js':1,'selects.js':1,'sort.js':1,'maps.js':1},fromRoot:{'api/openapi.js':1,'api/share.js':1,'apps_flash.js':1,'mentions.js':1,'map2.js':1,'ui_controls.css':1,'map.css':1,'paginated_table.js':1,'paginated_table.css':1}}; var _rnd = 1285;