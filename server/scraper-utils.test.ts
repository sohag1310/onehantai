import test from 'node:test';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import {
  cleanSlug,
  buildWatchUrl,
  upscalePosterUrl,
  isBadIframeUrl,
  extractServersFromHtml,
} from './scraper-utils.ts';

test('cleanSlug removes prefixes and normalizes text', () => {
  assert.equal(cleanSlug('anime-jojos-bizarre-adventure'), 'jojos-bizarre-adventure');
  assert.equal(cleanSlug('series-naruto-shippuden'), 'naruto-shippuden');
  assert.equal(cleanSlug('movies-demon-slayer-mugen-train'), 'demon-slayer-mugen-train');
  assert.equal(cleanSlug('videos-bleach-tybw'), 'bleach-tybw');
  assert.equal(cleanSlug('Solo-Leveling!@#'), 'solo-leveling');
});

test('buildWatchUrl creates correct structured watch page link', () => {
  const url = buildWatchUrl({
    slug: 'anime-jojos-bizarre-adventure',
    season: 1,
    ep: 3,
    server: 'multi-2',
    lang: 'hin',
  });
  assert.match(url, /\/videos\/anime\/jojos-bizarre-adventure\?/);
  assert.match(url, /season=1/);
  assert.match(url, /ep=3/);
  assert.match(url, /server=multi-2/);
  assert.match(url, /lang=hin/);
});

test('upscalePosterUrl upgrades /wXXX/ to /w780/', () => {
  const lowRes = 'https://image.tmdb.org/t/p/w300/poster123.jpg';
  assert.equal(
    upscalePosterUrl(lowRes),
    'https://image.tmdb.org/t/p/w780/poster123.jpg'
  );

  const regularUrl = 'https://cdn.animestream.org/images/cover.jpg';
  assert.equal(upscalePosterUrl(regularUrl), regularUrl);
});

test('isBadIframeUrl detects tracking, ads, and json endpoints', () => {
  assert.equal(isBadIframeUrl('https://google_ads.doubleclick.net/pagead/ads'), true);
  assert.equal(isBadIframeUrl('https://disqus.com/embed/comments'), true);
  assert.equal(isBadIframeUrl('https://stream.provider.com/config.json'), true);
  assert.equal(isBadIframeUrl('https://vidhide.com/embed/xyz123'), false);
  assert.equal(isBadIframeUrl('https://streamwish.to/e/abc456'), false);
});

test('extractServersFromHtml parses clean video iframes and labels', () => {
  const sampleHtml = `
    <div>
      <button class="server-btn">VidHide HD</button>
      <button class="server-btn">StreamWish Fast</button>
      <iframe src="https://vidhide.com/embed/v123"></iframe>
      <iframe src="//streamwish.to/e/sw999"></iframe>
      <iframe src="https://google_ads.com/banner"></iframe>
    </div>
  `;

  const servers = extractServersFromHtml(sampleHtml, cheerio);
  assert.equal(servers.length, 2);
  assert.equal(servers[0].name, 'VidHide HD');
  assert.equal(servers[0].url, 'https://vidhide.com/embed/v123');
  assert.equal(servers[1].name, 'StreamWish Fast');
  assert.equal(servers[1].url, 'https://streamwish.to/e/sw999');
});
