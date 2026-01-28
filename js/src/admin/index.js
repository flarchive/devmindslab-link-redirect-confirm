import app from 'flarum/admin/app';

app.initializers.add('devmindslab-link-redirect-confirm', () => {
  app.extensionData
    .for('devmindslab-link-redirect-confirm')
    .registerSetting({
      setting: 'devmindslab-link-redirect-confirm.whitelist',
      label: app.translator.trans('devmindslab-link-redirect-confirm.admin.settings.whitelist_label'),
      help: app.translator.trans('devmindslab-link-redirect-confirm.admin.settings.whitelist_help'),
      type: 'text',
    });
});
