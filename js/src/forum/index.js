import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';

class ConfirmExternalLinkModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);
    this.url = vnode.attrs.url;
  }

  className() {
    return 'Modal--small LinkRedirectConfirmModal';
  }

  title() {
    return app.translator.trans('devmindslab-link-redirect-confirm.forum.modal.title');
  }

  content() {
    const displayUrl = this.url || '';
    return (
      <div className="Modal-body">
        <p>
          {app.translator.trans('devmindslab-link-redirect-confirm.forum.modal.body')}
        </p>
        {displayUrl ? (
          <p className="LinkRedirectConfirmModal-link">
            {app.translator.trans('devmindslab-link-redirect-confirm.forum.modal.link', {
              url: displayUrl,
            })}
          </p>
        ) : null}
        <div className="Form-group">
          {Button.component(
            {
              className: 'Button Button--secondary',
              onclick: () => this.hide(),
            },
            app.translator.trans('devmindslab-link-redirect-confirm.forum.modal.cancel')
          )}
          {Button.component(
            {
              className: 'Button Button--primary',
              onclick: () => this.confirm(),
            },
            app.translator.trans('devmindslab-link-redirect-confirm.forum.modal.confirm')
          )}
        </div>
      </div>
    );
  }

  confirm() {
    if (!this.url) return;
    window.open(this.url, '_blank', 'noopener,noreferrer');

    this.hide();
  }
}

function getForumBaseUrl() {
  return (
    (app.forum && app.forum.attribute && app.forum.attribute('baseUrl')) ||
    (app.forum && app.forum.attribute && app.forum.attribute('base_url')) ||
    (app.data && app.data.attributes && app.data.attributes.baseUrl) ||
    ''
  );
}

function parseWhitelist(raw) {
  if (!raw) return [];
  return raw
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeWhitelistEntry(entry) {
  if (!entry) return '';
  let value = entry.trim();

  // Strip scheme if provided
  value = value.replace(/^https?:\/\//i, '');

  // Drop any path/query/fragment/port
  value = value.split('/')[0];
  value = value.split('?')[0];
  value = value.split('#')[0];

  return value.trim();
}

function hostnameMatches(hostname, entry) {
  if (!entry) return false;
  const normalized = normalizeWhitelistEntry(entry);
  const clean = normalized.replace(/^\*\./, '').toLowerCase();
  const host = hostname.toLowerCase();
  return host === clean || host.endsWith(`.${clean}`);
}

function isWhitelisted(hostname, whitelist) {
  return whitelist.some((entry) => hostnameMatches(hostname, entry));
}

function isExternalLink(url, baseHost, whitelist) {
  if (!url || !url.hostname) return false;

  if (url.hostname.toLowerCase() === baseHost.toLowerCase()) return false;
  if (isWhitelisted(url.hostname, whitelist)) return false;

  return true;
}

function shouldIgnoreClick(event, anchor) {
  if (!anchor || !anchor.href) return true;
  if (anchor.hasAttribute('data-no-redirect-confirm')) return true;
  if (event.defaultPrevented) return true;
  if (event.button && event.button !== 0) return true; // ignore middle/right click
  return false;
}

app.initializers.add('devmindslab-link-redirect-confirm', () => {
  const baseUrl = getForumBaseUrl();
  let baseHost = '';

  try {
    baseHost = new URL(baseUrl).hostname;
  } catch (e) {
    baseHost = window.location.hostname;
  }

  const whitelistSetting =
    (app.forum && app.forum.attribute && app.forum.attribute('linkRedirectConfirmWhitelist')) ||
    (app.data && app.data.attributes && app.data.attributes.linkRedirectConfirmWhitelist) ||
    '';
  const whitelist = parseWhitelist(whitelistSetting).concat([baseHost]);

  document.addEventListener(
    'click',
    (event) => {
      const anchor = event.target && event.target.closest ? event.target.closest('a') : null;
      if (shouldIgnoreClick(event, anchor)) return;

      let url;
      try {
        url = new URL(anchor.getAttribute('href'), baseUrl || window.location.href);
      } catch (e) {
        return;
      }

      if (!['http:', 'https:'].includes(url.protocol)) return;

      if (!isExternalLink(url, baseHost, whitelist)) return;

      event.preventDefault();
      event.stopPropagation();

      app.modal.show(ConfirmExternalLinkModal, {
        url: url.href,
      });
    },
    true
  );
});
