//单实例
define(
		[],
		function(tpl) {
			// 考虑不污染全局变量，建立唯一的命名空间
			
			var _app = undefined;

			function _buildViewModel(properties) {
				// 1 window&&tabBar
				var _window = {
					barTitleText : undefined,
					showBackButton : false,
					showMenuButton : true
				};
				if (properties.window) {
					_window.barTitleText = properties.window.barTitleText ? properties.window.barTitleText
							: undefined;
					// _window.showLeftButton=properties.window.showLeftButton;
					// _window.showMenuButton=properties.window.showMenuButton;
				}

				var _tabBar = {
					list : [],
					position : "bottom",
					visible : true
				};
				if (properties.tabBar) {
					_tabBar.list = properties.tabBar.list ? properties.tabBar.list
							: [];
				}

				var _viewModel = new can.Map({
					window : _window,
					tabBar : _tabBar
				});
				return _viewModel;
			}

			function _App(properties) {
				// 属性
				this.template = "App.stache";
				this.helpers = properties.helpers || [];
				this.pages = properties.pages || [];
				this.menu = properties.menu || [];
				// 加入imports属性，增加加载文件
				this.imports = properties.imports || [];
				// except pages
				this.viewModel = _buildViewModel(properties);
				// 3 其它内容
				var _self = this;
				can.each(properties, function(value, key) {
					if (key == "window")
						return;
					if (key == "tabBar")
						return;
					if (key == "pages")
						return;
					if (key == "imports")
						return;
					if (key == "menu")
						return;
					if (key == "helpers")
						return;
					_self[key] = value;
				});

				// App事件
				// this.onLaungh = properties.onLaungh || undefined;
				// this.onError = properties.onError || undefined;

				// 方法
				this.setBarTitleText = function(text) {
					this.viewModel.window.attr("barTitleText", text);
				};
				this.setBackButtonVisible = function(value) {
					if (value) {
						if (this.viewModel.window.backList)
							this.viewModel.window.attr("showBackButton", true);
						else {
							this.viewModel.window.backList = [];
							// 不做计算属性，后台控制
							this.viewModel.window.attr("showBackButton", false);
						}
					} else {
						this.viewModel.window.backList = undefined;
						this.viewModel.window.attr("showBackButton", false);
					}
				};
				this.setMenuButtonVisible = function(value) {
					this.viewModel.window.attr("showMenuButton", value);
				};
				this.setTabBarVisible = function(value) {
					this.viewModel.tabBar.attr("visible", value);
				};
				this.addTabBar = function(text, page) {
					this.viewModel.tabBar.attr("list").push({
						text : text,
						page : page
					});
				};
				this.laungh = function(cb) {
					self = this;
					requirejs([ "text!" + self.template ], function(tpl) {
						var _view = new MF.Template.Stache(tpl, self.viewModel,
								self.helpers);
						$(function() {
							cb(_view);
						});
					});

				};
			}

			// 以下为全局方法
			function App(properties) {
				// new app，调用 laungh 将赋值到 _app
				_app = new _App(properties);
			}
			;

			function getApp() {
				if (!_app)
					_app = new _App({});
				return _app;
			}
			;

			

			// 注入mzui
			_Popup = new $.Display({});

			return {
				App:App,
				getApp:getApp,
				Popup:_Popup
			};
		});