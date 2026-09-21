var base_url = 'http://www.fpgachina.cn/rest/pc';
// var base_url = 'http://test.fpgachina.cn/rest/pc';
// var base_url = 'http://localhost:84/rest/pc';
window.base_url = base_url;

// ==================== 微信开放平台扫码配置 ====================
// 说明：微信 OAuth 的 redirect_uri 必须指向后端回调接口（域名需在微信开放平台配置授权回调域）。
// 统一从 base_url 推导，切换环境时只改 base_url 一处即可，避免各页面硬编码域名不一致。
var WX_WEB_APPID = 'wxb2c4d33355ec0c10';
// 二维码样式（隐藏微信默认标题/提示，压缩尺寸）
var WX_QR_STYLE_HREF = 'data:text/css;base64,LmxvZ2luUGFuZWwubm9ybWFsUGFuZWwgLnRpdGxlIHsNCiAgZGlzcGxheTogbm9uZTsNCn0NCi5xcmNvZGUubGlnaHRCb3JkZXIgew0KICB3aWR0aDogMTc0cHg7DQogIGhlaWdodDogMTc0cHg7DQogIG1hcmdpbi10b3A6IDA7DQogIGJveC1zaXppbmc6IGJvcmRlci1ib3g7DQp9DQouaW1wb3dlckJveCAuaW5mbyB7DQogIGRpc3BsYXk6IG5vbmU7DQp9DQoud2ViX3FyY29kZV90eXBlX2lmcmFtZSB7DQogIHdpZHRoOiAxNzRweDsNCn0NCg==';

/**
 * 拼接微信扫码回调地址
 * @param {string} path 后端回调路径，如 '/user/wechat/callback'
 * @returns {string} 完整 redirect_uri
 */
function getWxRedirectUri(path) {
  var base = (window.base_url || 'http://www.fpgachina.cn/rest/pc').replace(/\/+$/, '');
  return base + path;
}
window.WX_WEB_APPID = WX_WEB_APPID;
window.WX_QR_STYLE_HREF = WX_QR_STYLE_HREF;
window.getWxRedirectUri = getWxRedirectUri;

// 当前请求语言头，zh 或 en
// 从 localStorage 读取当前语言偏好，避免依赖 i18n.js 的 bootstrap() 调用
// 解决 i18n.js 在 httpUtils.js 之前加载导致 setLangHeader 未定义的问题
var currentLang = (function() {
  try {
    var stored = localStorage.getItem('fpga_lang');
    return (stored === 'en-US') ? 'en' : 'zh';
  } catch (e) {
    return 'zh';
  }
})();
function setLangHeader(lang) {
  if (currentLang !== lang) {
    currentLang = lang;
    // 语言变更后清空接口缓存，确保重新拉取新语言的数据
    HttpCache.clear();
  }
}

/**
 * HTTP请求缓存管理器
 */
const HttpCache = {
  prefix: 'fpga_http_cache_',
  memCache: {}, // 内存快速通道：同一次会话内即时命中
  defaultTTL: 5 * 60 * 1000, // 默认缓存5分钟

  generateKey(url, data) {
    return `${url}_${JSON.stringify(data || {})}`;
  },

  // 存储 key 经 md5 哈希，避免 URL/参数过长或含非法字符
  _storeKey(key) {
    return this.prefix + md5(key);
  },

  get(url, data) {
    const key = this.generateKey(url, data);
    // 1) 内存优先
    const memItem = this.memCache[key];
    if (memItem && Date.now() <= memItem.expiry) return memItem.data;
    if (memItem) delete this.memCache[key];
    // 2) localStorage 持久化：跨页面跳转 / 刷新后仍命中，消除每次进入首页的 ~1 秒延迟
    try {
      const raw = localStorage.getItem(this._storeKey(key));
      if (raw) {
        const item = JSON.parse(raw);
        if (Date.now() <= item.expiry) {
          this.memCache[key] = item; // 回灌内存，下次同会话更快
          return item.data;
        }
        localStorage.removeItem(this._storeKey(key));
      }
    } catch (e) {}
    return null;
  },

  set(url, data, responseData, ttl = this.defaultTTL) {
    const key = this.generateKey(url, data);
    const item = { data: responseData, expiry: Date.now() + ttl };
    this.memCache[key] = item;
    try {
      localStorage.setItem(this._storeKey(key), JSON.stringify(item));
    } catch (e) {
      // 超出配额时忽略，降级为仅内存缓存
    }
  },

  clear() {
    this.memCache = {};
    try {
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(this.prefix) === 0) toRemove.push(k);
      }
      toRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
  },

  remove(url, data) {
    const key = this.generateKey(url, data);
    delete this.memCache[key];
    try {
      localStorage.removeItem(this._storeKey(key));
    } catch (e) {}
  },
};

/**
 * 轮播图图片缓存：把图片字节（data URL）持久化到 localStorage，命中即瞬时渲染，
 * 消除「数据已缓存优先、但图片仍要现下载 ~1 秒」的空白。
 * 跨域图片需后端返回 Access-Control-Allow-Origin 才能读取像素；被 CORS 拦截则静默降级为普通 URL（走浏览器 HTTP 缓存）。
 */
const BannerImageCache = {
  prefix: 'fpga_img_cache_',
  mem: {},
  maxSize: 600 * 1024, // 单图上限 600KB，超出不缓存，避免撑爆 localStorage
  get(bid) {
    if (!bid) return null;
    if (this.mem[bid]) return this.mem[bid];
    try {
      const raw = localStorage.getItem(this.prefix + bid);
      if (raw) { this.mem[bid] = raw; return raw; }
    } catch (e) {}
    return null;
  },
  set(bid, dataUrl) {
    this.mem[bid] = dataUrl;
    try {
      localStorage.setItem(this.prefix + bid, dataUrl);
    } catch (e) { /* 配额超限则仅保留内存 */ }
  },
  // 首次加载时异步抓取图片并缓存为 data URL；CORS / 网络失败静默跳过，降级为普通 URL
  fetchAndCache(bid, url) {
    if (!bid || !url || this.get(bid)) return;
    try {
      fetch(url, { mode: 'cors', cache: 'force-cache' })
        .then(function (resp) { return resp && resp.ok ? resp.blob() : null; })
        .then(function (blob) {
          if (!blob || blob.size > BannerImageCache.maxSize) return;
          const reader = new FileReader();
          reader.onload = function () { BannerImageCache.set(bid, reader.result); };
          reader.readAsDataURL(blob);
        })
        .catch(function () { /* CORS 或网络失败，降级为普通 URL */ });
    } catch (e) {}
  }
};

/**
 * 提交请求锁管理器 —— 防止同一 POST 请求在处理期间被重复发起（防重复提交）
 *
 * 锁 key = url + '::' + md5(去空值后的业务参数)
 * - 用「签名前的原始业务参数」参与计算，不含 timestamp/nonce/sign 这些每次都变的随机量，
 *   保证「同内容请求被锁、不同实体/不同内容不互锁」。
 * - 仅作用于 httpPostWithRetry，GET 不受影响。
 */
const SubmitLock = {
  pending: {}, // key -> 加锁时间戳(ms)
  TTL: 60 * 1000, // 僵尸锁保护上限：60s（ajax 自身 30s 超时，此处仅为极端兜底）

  // 生成锁 key
  generateKey(url, data) {
    var clean = {};
    if (data && typeof data === 'object') {
      // 按键排序 + 去空值，确保等价参数生成相同 key
      Object.keys(data)
        .sort()
        .forEach(function (k) {
          var v = data[k];
          if (v !== null && v !== '' && v !== undefined) clean[k] = v;
        });
    }
    var body;
    try {
      body = JSON.stringify(clean);
    } catch (e) {
      body = String(data);
    }
    return url + '::' + md5(body);
  },

  // 尝试加锁：返回 true=获取成功；false=已有相同请求在进行中
  tryAcquire(key) {
    var now = Date.now();
    if (Object.prototype.hasOwnProperty.call(this.pending, key)) {
      // 僵尸锁保护：超过 TTL 未释放的锁强制清理（防御异常未回调）
      if (now - this.pending[key] > this.TTL) {
        console.warn('[防重复提交] 清理僵尸锁:', key);
      } else {
        return false;
      }
    }
    this.pending[key] = now;
    return true;
  },

  // 释放锁
  release(key) {
    delete this.pending[key];
  },
};

/**
 * 网络状态检测
 */
const NetworkStatus = {
  isOnline: navigator.onLine,
  listeners: [],

  init() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
    });
  },

  addListener(callback) {
    this.listeners.push(callback);
  },

  removeListener(callback) {
    this.listeners = this.listeners.filter((l) => l !== callback);
  },

  notifyListeners(status) {
    this.listeners.forEach((callback) => callback(status));
  },
};

// 初始化网络状态监听
NetworkStatus.init();

/**
 * 检测是否运行在壳页面（dashboard / 首页 index.html）的 iframe 中，是则将消息转发给父页面显示
 * 解决 iframe 内 Message 固定在 iframe 顶部、被壳页面头部遮挡或随页面滚动不可见的问题
 */
function isInDashboardFrame() {
  try {
    return window.parent && window.parent !== window && (window.parent.__isDashboard || window.parent.__isShellPage);
  } catch (e) {
    return false;
  }
}

/**
 * 显示错误提示
 */
function showError(message, duration = 3000) {
  // 兼容后端 `错误码||默认文案` 格式，只展示可读的默认文案，避免把错误码原样弹出
  message = getErrDisplayMsg(message);
  if (isInDashboardFrame()) {
    window.parent.postMessage({ type: 'dashboard-message', message: message, msgType: 'error', duration: duration }, '*');
    return;
  }
  if (window.ELEMENT && window.ELEMENT.Message) {
    window.ELEMENT.Message({
      showClose: true,
      message: message,
      type: 'error',
      duration: duration,
    });
  } else {
    alert(message);
  }
}

/**
 * 显示成功提示
 */
function showSuccess(message, duration = 3000) {
  if (isInDashboardFrame()) {
    window.parent.postMessage({ type: 'dashboard-message', message: message, msgType: 'success', duration: duration }, '*');
    return;
  }
  if (window.ELEMENT && window.ELEMENT.Message) {
    window.ELEMENT.Message({
      showClose: true,
      message: message,
      type: 'success',
      duration: duration,
    });
  }
}

/**
 * 解析后端返回的错误消息。
 * 后端错误码可能以 `code||默认文案` 形式返回（如 `account.not.audit||当前已有联络人且审核已通过`），
 * 本函数将其拆分为错误码与默认文案，供前端按错误码精确判断并展示友好的默认文案。
 * @param {string} msg 后端返回的原始错误消息
 * @returns {{code: string, defaultMsg: string}} 拆分结果
 */
function parseErrMsg(msg) {
  if (typeof msg !== 'string') return { code: msg, defaultMsg: '' };
  var idx = msg.indexOf('||');
  if (idx === -1) return { code: msg, defaultMsg: '' };
  return { code: msg.substring(0, idx), defaultMsg: msg.substring(idx + 2) };
}
window.parseErrMsg = parseErrMsg;

/**
 * 获取要展示给用户的错误文案。
 * 优先使用后端随错误码提供的默认文案，其次回退到原始消息，避免把 `code||文案` 原样弹出。
 * @param {string} msg 后端返回的原始错误消息
 * @returns {string} 展示文案
 */
function getErrDisplayMsg(msg) {
  var parsed = parseErrMsg(msg);
  return parsed.defaultMsg || parsed.code || msg;
}
window.getErrDisplayMsg = getErrDisplayMsg;

/**
 * 构造「帐号审核未通过」登录提示，拼接管理员填写的不通过原因。
 * 被拒账号无法登录，登录提示是触达用户的唯一渠道，故把管理员填写的拒绝原因拼接展示。
 * 后端在 /user/login 返回 msg==='account.not.audit' 时，会附带拒绝原因，字段优先级：
 *   err.rejectReason  >  err.data.rejectReason  >  err.reason
 * @param {object} err 登录失败响应（含 msg 与可选原因字段）
 * @param {function} t i18n 翻译函数
 * @returns {string} 展示文案
 */
function formatNotAuditMessage(err, t) {
  var baseKey = 'loginAccountNotAudit';
  var base = '帐号审核未通过，无法登录，请联系管理员';
  if (t && typeof t === 'function') {
    var translated = t(baseKey);
    if (translated && translated !== baseKey) base = translated;
  }
  var reason = '';
  // 后端登录拦截返回 `account.not.audit||拒绝原因`：拒绝原因放在 || 后（如“当前已有联络人且审核已通过”），
  // 作为「原因」展示，而非整条文案
  if (err && typeof err.msg === 'string') {
    var parsed = parseErrMsg(err.msg);
    if (parsed.defaultMsg) reason = parsed.defaultMsg;
  }
  if (!reason && err) {
    if (err.rejectReason != null && err.rejectReason !== '') {
      reason = err.rejectReason;
    } else if (err.data && err.data.rejectReason) {
      reason = err.data.rejectReason;
    } else if (err.reason != null && err.reason !== '') {
      reason = err.reason;
    }
  }
  if (reason) {
    var labelKey = 'accountAuditRejectedTip';
    var label = '审核未通过，原因：';
    if (t && typeof t === 'function') {
      var lt = t(labelKey);
      if (lt && lt !== labelKey) label = lt;
    }
    return label + reason;
  }
  return base;
}
window.formatNotAuditMessage = formatNotAuditMessage;

/**
 * 获取网络错误描述
 */
function getNetworkErrorDesc(error) {
  if (!navigator.onLine) {
    return '网络连接已断开，请检查您的网络设置';
  }
  if (error.status === 0) {
    return '网络请求超时，请稍后重试';
  }
  if (error.status === 404) {
    return '请求的资源不存在';
  }
  if (error.status === 500) {
    return '服务器内部错误，请稍后重试';
  }
  if (error.status === 502 || error.status === 503) {
    return '服务器正在维护中，请稍后重试';
  }
  if (error.status === 504) {
    return '网关超时，请稍后重试';
  }
  return '网络请求失败，请检查网络连接';
}

/**
 * 带重试机制的HTTP GET请求
 */
var httpGetWithRetry = function (url, data, isLoad = false, that, options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    useCache = false,
    cacheTTL = 5 * 60 * 1000,
  } = options;

  return new Promise((resolve, reject) => {
    // 检查缓存（缓存优先：命中即即时返回，消除首屏空白/转圈）
    if (useCache && !options._forceNetwork) {
      const cachedData = HttpCache.get(url, data);
      if (cachedData) {
        console.log('[缓存优先] 命中，即时返回:', url);
        resolve({ code: 200, data: cachedData });
        // 命中后静默后台刷新最新数据并写入缓存；如需更新已渲染视图可传 onCacheUpdate
        if (options.backgroundRefresh) {
          const refreshOpts = Object.assign({}, options, {
            useCache: true,
            _forceNetwork: true, // 跳过读缓存，强制走网络
            backgroundRefresh: false,
            _silent: true, // 静默：不弹错误、不触发 loading
          });
          httpGetWithRetry(url, data, false, null, refreshOpts)
            .then(function (fresh) {
              if (fresh && fresh.code == 200 && typeof options.onCacheUpdate === 'function') {
                options.onCacheUpdate(fresh.data);
              }
            })
            .catch(function () {
              /* 静默失败，继续用缓存 */
            });
        }
        return;
      }
    }

    // 检查网络状态
    if (!navigator.onLine) {
      reject({ code: -1, msg: '网络连接已断开' });
      return;
    }

    let loading = null;
    if (isLoad && that && that.$loading) {
      loading = that.$loading({
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    }

    let signedParams = signUtil.getRequestData(data || {});
    let attempt = 0;

    const attemptRequest = () => {
      attempt++;
      console.log(`请求 ${url}，尝试次数: ${attempt}`);

      $.ajax({
        type: 'GET',
        url: url.indexOf('http') >= 0 ? url : base_url + url,
        cache: false,
        timeout: 30000,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: (function() {
          var h = { lang: currentLang };
          var token = localStorage.getItem('token');
          if (token) { h.token = token; }
          return h;
        })(),
        data: signedParams,
        success: function (data) {
          if (loading) loading.close();

          // 检测登录过期：NOT_LOGGED_IN(10000)、TOKEN_INVALID(10001) 或 TOKEN_EXPIRED(10002)
          if (data.code === 10000 || data.code === 10001 || data.code === 10002) {
            handleAuthExpired();
            reject(data);
            return;
          }

          // 成功获取数据后写入缓存（缓存优先命中返回或强制网络刷新都写）
          if ((useCache || options._forceNetwork) && data.code == 200) {
            HttpCache.set(url, data, data.data, cacheTTL);
          }

          resolve(data);
        },
        error: function (error) {
          console.error(`请求失败 (尝试 ${attempt}/${maxRetries}):`, error);

          // 检测 HTTP 401 未授权
          if (error.status === 401) {
            if (loading) loading.close();
            handleAuthExpired();
            reject({ code: 401, msg: '登录已过期，请重新登录' });
            return;
          }

          // 判断是否是网络错误，可以重试
          const canRetry =
            attempt < maxRetries &&
            (error.status === 0 ||
              error.status === 504 ||
              error.status === 502);

          if (canRetry) {
            const delay = retryDelay * attempt;
            console.log(`${delay}ms 后重试...`);
            setTimeout(attemptRequest, delay);
          } else {
            if (loading) loading.close();
            const errorMsg = getNetworkErrorDesc(error);
            reject({ code: error.status || -1, msg: errorMsg });
          }
        },
      });
    };

    attemptRequest();
  });
};

/**
 * 带重试机制的HTTP POST请求
 */
var httpPostWithRetry = function (
  url,
  data,
  showLoading = false,
  that,
  isLogin = false,
  options = {}
) {
  const { maxRetries = 3, retryDelay = 1000 } = options;

  return new Promise((resolve, reject) => {
    // 检查网络状态
    if (!navigator.onLine) {
      reject({ code: -1, msg: '网络连接已断开' });
      return;
    }

    // === 防重复提交锁 ===
    // 基于(url+业务参数)生成 key，同一请求处理期间只允许发起一次；
    // 重试期间保持锁定，仅在最终成功/失败时释放（见下方 success/error 回调）。
    const lockKey = SubmitLock.generateKey(url, data);
    if (!SubmitLock.tryAcquire(lockKey)) {
      // 已有相同请求在进行：静默拦截，不弹错误（避免骚扰用户的正常连点）
      console.debug('[防重复提交] 拦截重复请求:', url);
      reject({ code: 'DUPLICATE_SUBMIT', msg: '请勿重复提交', __duplicate: true });
      return;
    }

    let signedParams = signUtil.getRequestData(data);
    let loading = null;
    if (showLoading && that && that.$loading) {
      loading = that.$loading({
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    }

    let attempt = 0;

    const attemptRequest = () => {
      attempt++;
      console.log(`POST请求 ${url}，尝试次数: ${attempt}`);

      $.ajax({
        type: 'POST',
        url: url.indexOf('http') >= 0 ? url : base_url + url,
        dataType: 'json',
        cache: false,
        timeout: 30000,
        headers: (function() {
          var h = { lang: currentLang };
          var token = localStorage.getItem('token');
          if (token) { h.token = token; }
          return h;
        })(),
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(signedParams),
        success: function (data) {
          if (loading) loading.close();
          SubmitLock.release(lockKey); // 请求已结束，释放防重复锁

          // 检测登录过期：NOT_LOGGED_IN(10000)、TOKEN_INVALID(10001) 或 TOKEN_EXPIRED(10002)
          if (data.code === 10000 || data.code === 10001 || data.code === 10002) {
            handleAuthExpired();
            reject && reject(data);
            return;
          }

          if (data.code == 200) {
            resolve(data);
          } else {
            reject && reject(data);
            if (!options.suppressError) {
              showError(data.msg);
            }
          }
        },
        error: function (error) {
          console.error(`POST请求失败 (尝试 ${attempt}/${maxRetries}):`, error);

          // 检测 HTTP 401 未授权
          if (error.status === 401) {
            if (loading) loading.close();
            SubmitLock.release(lockKey);
            handleAuthExpired();
            reject({ code: 401, msg: '登录已过期，请重新登录' });
            return;
          }

          const canRetry =
            attempt < maxRetries &&
            (error.status === 0 ||
              error.status === 504 ||
              error.status === 502);

          if (canRetry) {
            const delay = retryDelay * attempt;
            console.log(`${delay}ms 后重试...`);
            setTimeout(attemptRequest, delay);
          } else {
            if (loading) loading.close();
            SubmitLock.release(lockKey); // 最终失败才释放（重试期间保持锁定）
            const errorMsg = getNetworkErrorDesc(error);
            showError(errorMsg);
            reject({ code: error.status || -1, msg: errorMsg });
          }
        },
      });
    };

    if (isLogin) {
      checkUserLogin();
    }
    attemptRequest();
  });
};

// 保留原有方法以兼容
var httpPost = function (url, data, showLoading = false, that, isLogin = false, options = {}) {
  return httpPostWithRetry(url, data, showLoading, that, isLogin, options);
};

var httpGet = function (url, data, isLoad = false, that, options = {}) {
  return httpGetWithRetry(url, data, isLoad, that, options);
};

var GetQueryString = function (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var search = decodeURI(window.location.search);
  var r = search.substr(1).match(reg);
  if (r != null) return decodeURI(unescape(r[2]));
  return null;
};

// ==================== 登录会话缓存管理 ====================

/**
 * 存储 token
 */
function setLoginToken(token) {
  localStorage.setItem('token', token);
}

/**
 * 检查登录状态是否有效（token 存在）
 */
function isLoginValid() {
  return !!localStorage.getItem('token');
}

/**
 * 刷新登录会话（当前无过期策略，保留接口兼容）
 */
function refreshLoginSession() {}

/**
 * 清除登录状态（token、userInfo）
 */
function clearLoginState() {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
}

var checkUserLogin = function () {
  if (!isLoginValid()) {
    window.ELEMENT.Message({
      showClose: true,
      message: '未登录',
      type: 'error',
    });
    return false;
  }
};
var isLogin = function () {
  return isLoginValid();
};

/**
 * 登录状态过期时的处理
 * 清除本地存储并跳转到首页
 */
function handleAuthExpired() {
  // 如果在 dashboard iframe 内，通过 postMessage 通知父页面处理
  if (isInDashboardFrame()) {
    window.parent.postMessage({
      type: 'logout-redirect',
      url: 'index.html'
    }, '*');
  } else {
    // 清除登录状态
    clearLoginState();
    sessionStorage.clear();
    // 跳转到首页
    window.location.href = 'index.html';
  }
}

/**
 * 签名工具类
 */
const defaultKey = 'kiHjr0YY2GXSu8FySitOKUiwRGmKwGaGFjc1Cm';

class SignUtil {
  getRequestData(params) {
    const paramsJson = flushData(params);
    const timestamp = SignUtil.getTimestamp();
    const nonce = SignUtil.generateNonce();
    const sign = SignUtil.generateSign(
      paramsJson,
      timestamp,
      nonce,
      defaultKey
    );
    const data = {
      ...paramsJson,
      timestamp,
      nonce,
      sign,
    };
    return data;
  }

  static stringifyForSign(value) {
    if (value === undefined || value === null) {
      return '';
    }
    if (Array.isArray(value)) {
      return `[${value
        .map((item) => SignUtil.stringifyForSign(item))
        .join(', ')}]`;
    }
    if (typeof value === 'object') {
      const keys = Object.keys(value).sort();
      const entries = keys.map(
        (key) => `${key}=${SignUtil.stringifyForSign(value[key])}`
      );
      return `{${entries.join(', ')}}`;
    }
    return String(value);
  }

  /**
   * 生成签名
   * @param {Object} params - 请求参数
   * @param {String} timestamp - 时间戳
   * @param {String} secretKey - 密钥
   * @returns {String} 签名
   */
  static generateSign(params, timestamp, nonce, secretKey) {
    const safeParams = { ...(params || {}) };
    // 去除空值参数
    Object.keys(safeParams).forEach((key) => {
      if (
        safeParams[key] === undefined ||
        safeParams[key] === null ||
        safeParams[key] === ''
      ) {
        delete safeParams[key];
      }
    });
    // 1. 去除签名字段（如果有）
    const signParams = { ...safeParams, timestamp, nonce };
    delete signParams.sign;
    // 2. 按ASCII码顺序排序参数名
    const keys = Object.keys(signParams).sort();

    // 3. 拼接参数
    let stringToSign = '';
    keys.forEach((key) => {
      if (signParams[key] !== undefined && signParams[key] !== null) {
        stringToSign += `${key}=${SignUtil.stringifyForSign(signParams[key])}&`;
      }
    });
    // 4. 拼接时间戳和密钥
    stringToSign += `key=${secretKey}`;
    // 5. 生成MD5签名（转大写）
    return md5(stringToSign).toUpperCase();
  }

  /**
   * 获取当前时间戳（秒）
   */
  static getTimestamp() {
    return Date.now().toString();
  }

  /**
   * 生成随机字符串
   */
  static generateNonce() {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }
}

const signUtil = new SignUtil();

var flushData = function (data) {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  let object = JSON.parse(JSON.stringify(data));
  for (const key in object) {
    const value = object[key];
    if (value === null || value === '' || value === undefined) {
      delete object[key];
    }
  }
  return object;
};

/**
 * MD5算法实现
 */
function md5(str) {
  var md5hash = function (message) {
    function rotateLeft(lValue, iShiftBits) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function addUnsigned(lX, lY) {
      var lX4, lY4, lX8, lY8, lResult;
      lX8 = lX & 0x80000000;
      lY8 = lY & 0x80000000;
      lX4 = lX & 0x40000000;
      lY4 = lY & 0x40000000;
      lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
      if (lX4 & lY4) {
        return lResult ^ 0x80000000 ^ lX8 ^ lY8;
      }
      if (lX4 | lY4) {
        if (lResult & 0x40000000) {
          return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
        } else {
          return lResult ^ 0x40000000 ^ lX8 ^ lY8;
        }
      } else {
        return lResult ^ lX8 ^ lY8;
      }
    }

    function F(x, y, z) {
      return (x & y) | (~x & z);
    }

    function G(x, y, z) {
      return (x & z) | (y & ~z);
    }

    function H(x, y, z) {
      return x ^ y ^ z;
    }

    function I(x, y, z) {
      return y ^ (x | ~z);
    }

    function FF(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function GG(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function HH(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function II(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function convertToWordArray(string) {
      var lWordCount;
      var lMessageLength = string.length;
      var lNumberOfWords_temp1 = lMessageLength + 8;
      var lNumberOfWords_temp2 =
        (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      var lWordArray = new Array(lNumberOfWords - 1);
      var lBytePosition = 0;
      var lByteCount = 0;

      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] =
          lWordArray[lWordCount] |
          (string.charCodeAt(lByteCount) << lBytePosition);
        lByteCount++;
      }

      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;

      return lWordArray;
    }

    function wordToHex(lValue) {
      var wordToHexValue = '';
      var lByte;
      var lCount;

      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        wordToHexValue +=
          '0123456789abcdef'.charAt((lByte >> 4) & 15) +
          '0123456789abcdef'.charAt(lByte & 15);
      }

      return wordToHexValue;
    }

    function uTF8Encode(string) {
      string = string.replace(/\r\n/g, '\n');
      var utftext = '';

      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }

      return utftext;
    }

    var x = convertToWordArray(uTF8Encode(message));
    var a = 0x67452301;
    var b = 0xefcdab89;
    var c = 0x98badcfe;
    var d = 0x10325476;

    for (var k = 0; k < x.length; k += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;

      a = FF(a, b, c, d, x[k + 0], 7, 0xd76aa478);
      d = FF(d, a, b, c, x[k + 1], 12, 0xe8c7b756);
      c = FF(c, d, a, b, x[k + 2], 17, 0x242070db);
      b = FF(b, c, d, a, x[k + 3], 22, 0xc1bdceee);
      a = FF(a, b, c, d, x[k + 4], 7, 0xf57c0faf);
      d = FF(d, a, b, c, x[k + 5], 12, 0x4787c62a);
      c = FF(c, d, a, b, x[k + 6], 17, 0xa8304613);
      b = FF(b, c, d, a, x[k + 7], 22, 0xfd469501);
      a = FF(a, b, c, d, x[k + 8], 7, 0x698098d8);
      d = FF(d, a, b, c, x[k + 9], 12, 0x8b44f7af);
      c = FF(c, d, a, b, x[k + 10], 17, 0xffff5bb1);
      b = FF(b, c, d, a, x[k + 11], 22, 0x895cd7be);
      a = FF(a, b, c, d, x[k + 12], 7, 0x6b901122);
      d = FF(d, a, b, c, x[k + 13], 12, 0xfd987193);
      c = FF(c, d, a, b, x[k + 14], 17, 0xa679438e);
      b = FF(b, c, d, a, x[k + 15], 22, 0x49b40821);

      a = GG(a, b, c, d, x[k + 1], 5, 0xf61e2562);
      d = GG(d, a, b, c, x[k + 6], 9, 0xc040b340);
      c = GG(c, d, a, b, x[k + 11], 14, 0x265e5a51);
      b = GG(b, c, d, a, x[k + 0], 20, 0xe9b6c7aa);
      a = GG(a, b, c, d, x[k + 5], 5, 0xd62f105d);
      d = GG(d, a, b, c, x[k + 10], 9, 0x02441453);
      c = GG(c, d, a, b, x[k + 15], 14, 0xd8a1e681);
      b = GG(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
      a = GG(a, b, c, d, x[k + 9], 5, 0x21e1cde6);
      d = GG(d, a, b, c, x[k + 14], 9, 0xc33707d6);
      c = GG(c, d, a, b, x[k + 3], 14, 0xf4d50d87);
      b = GG(b, c, d, a, x[k + 8], 20, 0x455a14ed);
      a = GG(a, b, c, d, x[k + 13], 5, 0xa9e3e905);
      d = GG(d, a, b, c, x[k + 2], 9, 0xfcefa3f8);
      c = GG(c, d, a, b, x[k + 7], 14, 0x676f02d9);
      b = GG(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);

      a = HH(a, b, c, d, x[k + 5], 4, 0xfffa3942);
      d = HH(d, a, b, c, x[k + 8], 11, 0x8771f681);
      c = HH(c, d, a, b, x[k + 11], 16, 0x6d9d6122);
      b = HH(b, c, d, a, x[k + 14], 23, 0xfde5380c);
      a = HH(a, b, c, d, x[k + 1], 4, 0xa4beea44);
      d = HH(d, a, b, c, x[k + 4], 11, 0x4bdecfa9);
      c = HH(c, d, a, b, x[k + 7], 16, 0xf6bb4b60);
      b = HH(b, c, d, a, x[k + 10], 23, 0xbebfbc70);
      a = HH(a, b, c, d, x[k + 13], 4, 0x289b7ec6);
      d = HH(d, a, b, c, x[k + 0], 11, 0xeaa127fa);
      c = HH(c, d, a, b, x[k + 3], 16, 0xd4ef3085);
      b = HH(b, c, d, a, x[k + 6], 23, 0x04881d05);
      a = HH(a, b, c, d, x[k + 9], 4, 0xd9d4d039);
      d = HH(d, a, b, c, x[k + 12], 11, 0xe6db99e5);
      c = HH(c, d, a, b, x[k + 15], 16, 0x1fa27cf8);
      b = HH(b, c, d, a, x[k + 2], 23, 0xc4ac5665);

      a = II(a, b, c, d, x[k + 0], 6, 0xf4292244);
      d = II(d, a, b, c, x[k + 7], 10, 0x432aff97);
      c = II(c, d, a, b, x[k + 14], 15, 0xab9423a7);
      b = II(b, c, d, a, x[k + 5], 21, 0xfc93a039);
      a = II(a, b, c, d, x[k + 12], 6, 0x655b59c3);
      d = II(d, a, b, c, x[k + 3], 10, 0x8f0ccc92);
      c = II(c, d, a, b, x[k + 10], 15, 0xffeff47d);
      b = II(b, c, d, a, x[k + 1], 21, 0x85845dd1);
      a = II(a, b, c, d, x[k + 8], 6, 0x6fa87e4f);
      d = II(d, a, b, c, x[k + 15], 10, 0xfe2ce6e0);
      c = II(c, d, a, b, x[k + 6], 15, 0xa3014314);
      b = II(b, c, d, a, x[k + 13], 21, 0x4e0811a1);
      a = II(a, b, c, d, x[k + 4], 6, 0xf7537e82);
      d = II(d, a, b, c, x[k + 11], 10, 0xbd3af235);
      c = II(c, d, a, b, x[k + 2], 15, 0x2ad7d2bb);
      b = II(b, c, d, a, x[k + 9], 21, 0xeb86d391);

      a = addUnsigned(a, olda);
      b = addUnsigned(b, oldb);
      c = addUnsigned(c, oldc);
      d = addUnsigned(d, oldd);
    }

    return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
  };

  return md5hash(str);
}

var successMessage = function (message) {
  if (isInDashboardFrame()) {
    window.parent.postMessage({ type: 'dashboard-message', message: message, msgType: 'success', duration: 3000 }, '*');
    return;
  }
  ELEMENT.Message({ type: 'success', message: message });
};
var errorMessage = function (message) {
  if (isInDashboardFrame()) {
    window.parent.postMessage({ type: 'dashboard-message', message: message, msgType: 'error', duration: 3000 }, '*');
    return;
  }
  ELEMENT.Message({ type: 'error', message: message });
};
window.successMessage = successMessage;
window.errorMessage = errorMessage;

// 如果在壳页面（dashboard / 首页）的 iframe 内运行，拦截 ELEMENT.Message 和 Vue.prototype.$message，
// 将消息转发给父页面显示，确保消息显示在最外层视口顶部，不被壳页面头部遮挡
(function() {
  try {
    if (!window.parent || window.parent === window ||
        (!window.parent.__isDashboard && !window.parent.__isShellPage)) return;
  } catch(e) { return; }

  function forwardToParent(options) {
    var msg, msgType = 'info', duration = 3000;
    if (typeof options === 'string') {
      msg = options;
    } else if (options) {
      msg = options.message || String(options);
      msgType = options.type || 'info';
      duration = options.duration || 3000;
    }
    window.parent.postMessage({
      type: 'dashboard-message',
      message: msg,
      msgType: msgType,
      duration: duration
    }, '*');
  }

  var _patchCount = 0;
  var _patchTimer = setInterval(function() {
    _patchCount++;
    if (window.ELEMENT && window.ELEMENT.Message) {
      window.ELEMENT.Message = function(options) { forwardToParent(options); };
      if (window.Vue && window.Vue.prototype && window.Vue.prototype.$message) {
        window.Vue.prototype.$message = function(options) { forwardToParent(options); };
      }
      clearInterval(_patchTimer);
    }
    if (_patchCount > 50) { clearInterval(_patchTimer); }
  }, 100);
})();

// 在壳页面 iframe 内拦截 MessageBox（$confirm / $alert / $prompt），
// 通过 postMessage 转发给父窗口外层渲染，弹框永远居中于顶层视口，
// 不受 iframe 尺寸/滚动影响；结果经 dashboard-confirm-result 回传，
// 业务页面的 .then()/.catch() 语义保持不变
(function() {
  try {
    // 仅 dashboard 壳页面实现了 dashboard-confirm 外层渲染，
    // 首页壳（__isShellPage）不处理该消息，故只在 dashboard iframe 内拦截
    if (!window.parent || window.parent === window ||
        !window.parent.__isDashboard) return;
  } catch(e) { return; }

  var _reqSeq = 0;
  var _pending = {};

  // 接收父窗口回传的用户选择，resolve/reject 对应 Promise
  window.addEventListener('message', function(e) {
    var d = e.data;
    if (!d || d.type !== 'dashboard-confirm-result' || !_pending[d.reqId]) return;
    var p = _pending[d.reqId];
    delete _pending[d.reqId];
    if (d.action === 'confirm') {
      // $prompt 确认时返回 { value, action }，与 Element UI 原生行为一致
      p.resolve(d.hasValue ? { value: d.value, action: 'confirm' } : 'confirm');
    } else {
      p.reject(d.action || 'cancel');
    }
  });

  // 归一化参数：支持 (message, title, options) 与 (options) 两种调用形式
  function normalizeArgs(args) {
    var first = args[0];
    if (typeof first === 'string' || typeof first === 'number') {
      var options = (args[2] && typeof args[2] === 'object') ? args[2] : {};
      return {
        message: String(first),
        title: (args[1] !== undefined && args[1] !== null) ? String(args[1]) : (options.title || ''),
        options: options
      };
    }
    if (first && typeof first === 'object') {
      var msg = first.message;
      if (typeof msg !== 'string' && typeof msg !== 'number') return null;
      return {
        message: String(msg),
        title: (first.title !== undefined && first.title !== null) ? String(first.title) : '',
        options: first
      };
    }
    return null;
  }

  // 仅转发可序列化、无高级回调的调用；其余降级回原生实现
  function canForward(norm) {
    var o = norm.options || {};
    if (typeof o.beforeClose === 'function') return false;
    if (o.callback) return false;
    if (o.inputPattern instanceof RegExp) return false;
    if (typeof o.inputValidator === 'function') return false;
    return true;
  }

  function forwardMessageBox(boxType, args, originalFn) {
    var norm = normalizeArgs(args);
    if (!norm || !canForward(norm)) {
      return originalFn.apply(window.ELEMENT.MessageBox, args);
    }
    var reqId = 'dash-cf-' + (++_reqSeq);
    // 剔除不可序列化的选项，避免 structured clone 报错
    var safeOptions = {};
    var src = norm.options || {};
    for (var k in src) {
      if (!Object.prototype.hasOwnProperty.call(src, k)) continue;
      var v = src[k];
      var t = typeof v;
      if (t === 'function' || v instanceof RegExp || (t === 'object' && v !== null)) continue;
      safeOptions[k] = v;
    }
    return new Promise(function(resolve, reject) {
      _pending[reqId] = { resolve: resolve, reject: reject };
      window.parent.postMessage({
        type: 'dashboard-confirm',
        reqId: reqId,
        boxType: boxType,
        message: norm.message,
        title: norm.title,
        options: safeOptions
      }, '*');
    });
  }

  // 兼容回调式调用：MessageBox(msg, title, opts, callback)
  function wrap(boxType, originalFn) {
    return function() {
      var args = Array.prototype.slice.call(arguments);
      var cb = args[args.length - 1];
      var hasCb = typeof cb === 'function';
      if (hasCb) args.pop();
      var ret = forwardMessageBox(boxType, args, originalFn);
      if (hasCb) {
        ret.then(function(action) {
          cb(action && typeof action === 'object' ? action.value : action);
        }).catch(function(action) {
          cb(action || 'cancel');
        });
        return undefined;
      }
      return ret;
    };
  }

  var _mbPatchCount = 0;
  var _mbPatchTimer = setInterval(function() {
    _mbPatchCount++;
    if (window.ELEMENT && window.ELEMENT.MessageBox) {
      var MB = window.ELEMENT.MessageBox;
      if (!MB.__dashForwarded) {
        MB.__dashForwarded = true;
        var origConfirm = MB.confirm, origAlert = MB.alert, origPrompt = MB.prompt;
        MB.confirm = wrap('confirm', origConfirm);
        MB.alert = wrap('alert', origAlert);
        MB.prompt = wrap('prompt', origPrompt);
        if (window.Vue && window.Vue.prototype) {
          window.Vue.prototype.$confirm = MB.confirm;
          window.Vue.prototype.$alert = MB.alert;
          window.Vue.prototype.$prompt = MB.prompt;
        }
      }
      clearInterval(_mbPatchTimer);
    }
    if (_mbPatchCount > 50) { clearInterval(_mbPatchTimer); }
  }, 100);
})();

// 兜底：吞掉「防重复提交」拦截产生的未捕获 rejection
// 多数页面 .then() 后无 .catch()，被锁请求的 reject 会变成 unhandledrejection 控制台警告，此处静默处理
window.addEventListener('unhandledrejection', function (event) {
  if (event && event.reason && event.reason.__duplicate) {
    event.preventDefault();
  }
});

// // 全局暴露
// window.isLogin = isLogin;
// window.checkUserLogin = checkUserLogin;
