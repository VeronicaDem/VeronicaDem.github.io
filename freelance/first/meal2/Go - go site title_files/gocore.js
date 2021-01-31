/* --------------------------------------------------------------------

  --------------------------------------------------------------------- */

$(function () {
	// Window listeners
	$(window).on("resize", function () {
		APP.fn.uploader.boxSizer();
		if (typeof user_background_full_fix == "function") {
			user_background_full_fix();
		}
		APP.fn.bindSelectableItems();
		APP.fn.listingViewer.placeholderSizing();
	});
	if (window.opener) {
		$(window).on("load", function (e) {
			window.opener.postMessage({
				id: window.name,
				requestAction: 'postSettings'
			}, "*");
		});
		$(window).on("message", function (e) {
			var data = e.originalEvent.data;
			if (typeof data.id == typeof undefined || typeof data.settings == typeof undefined) {
				return;
			}
			if (window.name !== data.id) {
				return;
			}
			APP.obj.opener.uploadPlugin[data.id] = data.settings;
		});
	}
	// Landing fancy load
	if ($("#home-cover, #maintenance-wrapper").exists()) {
		var landing_src = $("#maintenance-wrapper").exists() ? $("#maintenance-wrapper").css("background-image").slice(4, -1).replace(/^\"|\"$/g, "") : $(".home-cover-img", "#home-cover-slideshow").first().attr("data-src");

		function showHomeCover() {
			$("body").addClass("load");
			if (!$("#maintenance-wrapper").exists()) {
				$(".home-cover-img", "#home-cover-slideshow").first().css("background-image", "url(" + landing_src + ")").addClass("animate-in--alt").removeAttr("data-src");
			}
			setTimeout(function () {
				$("body").addClass("loaded");
				setTimeout(function () {
					showHomeSlideshow();
				}, 7000);
			}, 400 * 1.5);
		}

		var showHomeSlideshowInterval = function () {
			setTimeout(function () {
				showHomeSlideshow();
			}, 8000);
		};

		function showHomeSlideshow() {
			var $image = $(".home-cover-img[data-src]", "#home-cover-slideshow").first();
			var $images = $(".home-cover-img", "#home-cover-slideshow");
			if ($image.length == 0) {
				if ($images.length == 1) return;
				$images.first().removeClass("animate-in");
				$("#home-cover-slideshow").append($images.first());
				setTimeout(function () {
					$(".home-cover-img:last", "#home-cover-slideshow").addClass("animate-in");
				}, 20);
				setTimeout(function () {
					$(".home-cover-img:not(:last)", "#home-cover-slideshow").removeClass("animate-in");
				}, 4000);
				showHomeSlideshowInterval();
			} else {
				var src = $image.attr("data-src");
				$("<img/>").attr("src", src)
					.on("load error", function () {
						$(this).remove();
						$image.css("background-image", "url(" + src + ")").addClass("animate-in").removeAttr("data-src");
						setTimeout(function () {
							$(".home-cover-img:not(:last)", "#home-cover-slideshow").removeClass("animate-end animate-in--alt");
						}, 2000);
						showHomeSlideshowInterval();
					});
			}
		}

		if (landing_src) {
			$("<img/>").attr("src", landing_src)
				.on("load error", function () {
					$(this).remove();
					showHomeCover();
				});
		} else {
			showHomeCover();
		}
	}

	// Set the anywhere objects, just for shorter calling in $.
	var anywhere_upload = APP.fn.uploader.selectors.root,
		anywhere_upload_queue = APP.fn.uploader.selectors.queue,
		$anywhere_upload = $(anywhere_upload),
		$anywhere_upload_queue = $(anywhere_upload_queue);

	// Toggle anywhere upload on/off
	$(document).on("click", "[data-action=top-bar-upload]", function (e) {
		if ($("body").is("#upload")) return;
		APP.fn.uploader.toggle();
	});

	// Close upload box
	$("[data-action=close-upload]", $anywhere_upload).click(function () {
		if ($anywhere_upload.is(":animated")) return;
		$("[data-action=top-bar-upload]", "#top-bar").click();
	});

	// Reset upload box
	$("[data-action=reset-upload]", $anywhere_upload).click(function () {
		if (APP.fn.uploader.isUploading) {
			$("[data-action=cancel-upload-remaining], [data-action=cancel-upload]", $anywhere_upload).trigger("click");
		}
		APP.fn.uploader.reset();
	});

	// Cancel remaining uploads
	$("[data-action=cancel-upload-remaining], [data-action=cancel-upload]", $anywhere_upload).click(function () {
		APP.fn.uploader.isUploading = false;
		$("[data-action=cancel]", $anywhere_upload_queue).click();
		if (Object.size(APP.fn.uploader.results.success) > 0) {
			APP.fn.uploader.displayResults();
			return;
		} else {
			APP.fn.uploader.reset();
		}
	});

	// Toggle upload privacy
	$(document).on("click", "[data-action=upload-privacy]:not(disabled)", function (e) {
		if (e.isDefaultPrevented()) return;
		current_privacy = $(this).data("privacy");
		target_privacy = current_privacy == "public" ? "private" : "public";
		this_lock = $(".icon", this).data("lock");
		this_unlock = $(".icon", this).data("unlock");
		$(".icon", this).removeClass(this_lock + " " + this_unlock).addClass(current_privacy == "public" ? this_lock : this_unlock);
		$(this).data("privacy", target_privacy);

		$("[data-action=upload-privacy-copy]").html($("[data-action=upload-privacy]").html());

		$upload_button = $("[data-action=upload]", $anywhere_upload);
		$upload_button.text($upload_button.data(target_privacy));

		$(this).tipTip("hide");
	});

	// Do the thing when the fileupload changes
	$(APP.fn.uploader.selectors.file + ", " + APP.fn.uploader.selectors.camera).on("change", function (e) {
		if (!$(APP.fn.uploader.selectors.root).data("shown")) {
			APP.fn.uploader.toggle({
				callback: function (e) {
					APP.fn.uploader.add(e);
				}
			}, e);
		} else {
			APP.fn.uploader.add(e);
		}
	}).on("click", function (e) {
		if ($(this).data('login-needed') && !GO.fn.is_user_logged()) {
			return;
		}
	});

	function isFileTransfer(e) {
		var e = e.originalEvent,
			isFileTransfer = false;
		if (e.dataTransfer.types) {
			for (var i = 0; i < e.dataTransfer.types.length; i++) {
				if (e.dataTransfer.types[i] == "Files") {
					isFileTransfer = true;
					break;
				}
			}

		}
		return isFileTransfer;
	}

	// Enable uploader events
	if ($(APP.fn.uploader.selectors.root).exists()) {
		$("body").on({
			dragenter: function (e) {
				e.preventDefault();
				if (!isFileTransfer(e)) {
					return false;
				}
				if (!$(APP.fn.uploader.selectors.dropzone).exists()) {
					$("body").append($('<div id="' + APP.fn.uploader.selectors.dropzone.replace("#", "") + '"/>').css({
						width: "100%",
						height: "100%",
						position: "fixed",
						/* opacity: 0.5, background: "red",*/
						zIndex: 1000,
						left: 0,
						top: 0
					}));
				}
			}
		});
		$(document).on({
			dragover: function (e) {
				e.preventDefault();
				if (!isFileTransfer(e)) {
					return false;
				}
				if (!$(APP.fn.uploader.selectors.root).data("shown")) {
					APP.fn.uploader.toggle({
						reset: false
					});
				}
			},
			dragleave: function (e) {
				$(APP.fn.uploader.selectors.dropzone).remove();
				if ($.isEmptyObject(APP.fn.uploader.files)) {
					APP.fn.uploader.toggle();
				}
			},
			drop: function (e) {
				e.preventDefault();
				APP.fn.uploader.add(e);
				$(APP.fn.uploader.selectors.dropzone).remove();
			},
		}, APP.fn.uploader.selectors.dropzone);
	}

	//
	$(document).on("keyup change", "[data-action=resize-combo-input]", function (e) {
		var $parent = $(this).closest("[data-action=resize-combo-input]");
		var $input_width = $("[name=form-width]", $parent);
		var $input_height = $("[name=form-height]", $parent);
		var ratio = $input_width.data("initial") / $input_height.data("initial");
		var image = {
			width: Math.round($input_width.prop("value") / ratio),
			height: Math.round($input_height.prop("value") * ratio)
		};
		if ($(e.target).is($input_width)) {
			$input_height.prop("value", Math.round(image.width));
		} else {
			$input_width.prop("value", Math.round(image.height));
		}
	});

	// Edit item from queue
	$(document).on("click", anywhere_upload_queue + " [data-action=edit]", function () {
		var $item = $(this).closest("li"),
			$queue = $item.closest("ul"),
			id = $item.data("id"),
			file = APP.fn.uploader.files[id];

		var modal = GO.obj.modal.selectors.root;
		var queueObject = $.extend({}, file.formValues || file.parsedMeta);

		// Inject global upload options if needed
		var injectKeys = ["album_id", "category_id", "nsfw", "object_id"];
		for (var i = 0; i < injectKeys.length; i++) {
			var key = injectKeys[i];
			if (typeof queueObject[key] == typeof undefined) {
				var $object = $("[name=upload-" + key.replace("_", "-") + "]", APP.fn.uploader.selectors.root);
				var value = $object.prop($object.is(":checkbox") ? "checked" : "value");
				queueObject[key] = $object.is(":checkbox") ? (value ? "1" : null) : value;
			}
		}

		// Resize before upload
		GO.fn.modal.call({
			type: "html",
			template: $("#anywhere-upload-edit-item").html(),
			callback: function () {

				var imageMaxCfg = {
					width: APP.obj.config.image.max_width != 0 ? APP.obj.config.image.max_width : queueObject.width,
					height: APP.obj.config.image.max_height != 0 ? APP.obj.config.image.max_height : queueObject.height,
				};

				var imageMax = $.extend({}, imageMaxCfg);
				var ratio = queueObject.width / queueObject.height;

				imageMax.width = Math.round(imageMaxCfg.height * ratio);
				imageMax.height = Math.round(imageMaxCfg.width / ratio);

				if (imageMax.height > imageMaxCfg.height) {
					imageMax.height = imageMaxCfg.height;
					imageMax.width = Math.round(imageMax.height * ratio);
				}

				if (imageMax.width > imageMaxCfg.width) {
					imageMax.width = imageMaxCfg.width;
					imageMax.height = Math.round(imageMax.width / ratio);
				}

				$.each(queueObject, function (i, v) {

					var name = "[name=form-" + i.replace(/_/g, "-") + "]";
					var $input = $(name, modal);

					if (!$input.exists()) return true;

					// Input handler
					if ($input.is(":checkbox")) {
						$input.prop("checked", $input.attr("value") == v);
					} else if ($input.is("select")) {
						var $option = $input.find("[value=" + v + "]");
						if (!$option.exists()) {
							$option = $input.find("option:first");
						}
						$option.prop("selected", true);
					} else {
						$input.prop("value", v);
					}

					if (i == "width" || i == "height") {
						var max = imageMax[i];
						var value = file.parsedMeta[i] > max ? max : file.parsedMeta[i];
						$input.prop("max", value).data("initial", file.parsedMeta[i]).prop("value", value);
					}
				});

				// Warning on GIF images
				if (file.parsedMeta.mimetype !== "image/gif") {
					$("[ data-content=animated-gif-warning]", modal).remove();
				}

				// Canvas image preview
				$(".image-preview", modal).append($('<canvas/>', {
					'class': 'canvas'
				}));

				var source_canvas = $(".queue-item[data-id=" + id + "] .preview .canvas")[0];
				var target_canvas = $(".image-preview .canvas", modal)[0];

				target_canvas.width = source_canvas.width;
				target_canvas.height = source_canvas.height;

				var target_canvas_ctx = target_canvas.getContext('2d');

				target_canvas_ctx.drawImage(source_canvas, 0, 0);

			},
			confirm: function () {

				if (!GO.fn.form_modal_has_changed()) {
					GO.fn.modal.close();
					return;
				}

				// Validations (just in case)
				var errors = false;
				$.each(["width", "height"], function (i, v) {
					var $input = $("[name=form-" + v + "]", modal);
					var input_val = parseInt($input.val());
					var min_val = parseInt($input.attr("min"));
					var max_val = parseInt($input.attr("max"));
					if (input_val > max_val || input_val < min_val) {
						$input.highlight();
						errors = true;
						return true;
					}
				});

				if (errors) {
					GO.fn.growl.expirable(GO.fn._s("Check the errors in the form to continue."));
					return false;
				}

				if (typeof file.formValues == typeof undefined) {
					// Stock formvalues object
					file.formValues = {
						title: null,
						category_id: null,
						width: null,
						height: null,
						nsfw: null,
						expiration: null,
						description: null,
						album_id: null,
						object_id: null,
					};
				}

				$(":input[name]", modal).each(function (i, v) {
					var key = $(this).attr("name").replace("form-", "").replace(/-/g, "_");
					if (typeof file.formValues[key] == typeof undefined) return true;
					file.formValues[key] = $(this).is(":checkbox") ? ($(this).is(":checked") ? $(this).prop("value") : null) : $(this).prop("value");
				});

				APP.fn.uploader.files[id].formValues = file.formValues;

				return true;
			}
		});

	});

	// Remove item from queue
	$(document).on("click", anywhere_upload_queue + " [data-action=cancel]", function () {
		var $item = $(this).closest("li"),
			$queue = $item.closest("ul"),
			id = $item.data("id"),
			queue_height = $queue.height(),
			item_xhr_cancel = false;

		if ($item.hasClass("completed") || $item.hasClass("failed")) {
			return;
		}

		$("#tiptip_holder").hide();

		$item.tipTip("destroy").remove();

		if (queue_height !== $queue.height()) {
			APP.fn.uploader.boxSizer();
		}
		if (!$("li", $anywhere_upload_queue).exists()) {
			$("[data-group=upload-queue-ready], [data-group=upload-queue], [data-group=upload-queue-ready]", $anywhere_upload).css("display", "");
		}

		if (APP.fn.uploader.files[id] && typeof APP.fn.uploader.files[id].xhr !== "undefined") {
			APP.fn.uploader.files[id].xhr.abort();
			item_xhr_cancel = true;
		}

		if (typeof APP.fn.uploader.files[id] !== typeof undefined && typeof APP.fn.uploader.files[id].fromClipboard !== typeof undefined) {
			var c_md5 = APP.fn.uploader.files[id].md5;
			var c_index = APP.fn.uploader.clipboardImages.indexOf(c_md5);
			if (c_index > -1) {
				APP.fn.uploader.clipboardImages.splice(c_index, 1);
			}
		}

		delete APP.fn.uploader.files[id];

		APP.fn.uploader.queueSize();

		if (Object.size(APP.fn.uploader.files) == 0) { // No queue left
			// Null result ?
			if (!("success" in APP.fn.uploader) || !("results" in APP.fn.uploader) || (Object.size(APP.fn.uploader.results.success) == 0 && Object.size(APP.fn.uploader.results.error) == 0)) {
				APP.fn.uploader.reset();
			}
		} else {
			// Do we need to process the next item?
			if (item_xhr_cancel && $("li.waiting", $queue).first().length !== 0) {
				APP.fn.uploader.upload($("li.waiting", $queue).first());
			}

		}

	});

	// Uploader
	$(document).on("click", "[data-action=upload]", function () {
		$("[data-group=upload], [data-group=upload-queue-ready]", $anywhere_upload).hide();
		$anywhere_upload
			.removeClass('queueReady')
			.addClass('queueUploading')
			.find("[data-group=uploading]")
			.show();
		APP.fn.uploader.queueSize();
		APP.fn.uploader.canAdd = false;
		$queue_items = $("li", $anywhere_upload_queue);
		$queue_items.addClass("uploading waiting");
		APP.fn.uploader.timestamp = new Date().getTime();
		APP.fn.uploader.upload($queue_items.first("li"));
	});

	/*APP.obj.image_viewer.$container.swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			// right prev, left next
			if(direction == "left" || direction == "right") {
				var go = direction == "left" ? "next" : "prev",
					$link = $("[data-action="+go+"]", ".image-viewer-navigation");
				if($link.exists()) {
					window.location = $link.attr("href");
					return;
				}
			}
		},
		threshold: 100,
		excludedElements: ".noSwipe",
		allowPageScroll: "vertical"
	});*/

	// User page
	if ($("body#user").exists()) {
		if (GO.obj.listing.query_string.page > 1) {
			var State = History.getState();
			if (State.data && typeof State.data.scrollTop !== "undefined") {
				if ($(window).scrollTop() !== State.data.scrollTop) {
					$(window).scrollTop(State.data.scrollTop);
				}
			} else {
				//var scrollTop = $(".follow-scroll").offset().top - $(".follow-scroll").height();
				var scrollTop = $("#background-cover").height() - 160;
				$("html, body").animate({
					scrollTop: scrollTop
				}, 0);
			}
		}
		
	}

	if ($("#top-bar-shade").exists() && $("#top-bar-shade").css("opacity")) {
		$("#top-bar-shade").data("initial-opacity", Number($("#top-bar-shade").css("opacity")));
	}

	if (GO.fn.isDevice('phone')) {
		$("#top-bar-shade").css("opacity", 1);
	}

	$(window).on("scroll resize", function () {
		if (GO.fn.isDevice('phone')) {
			$("#background-cover-src").css("transform", "");
			$("#top-bar-shade").css("opacity", 1);
			return;
		}
		var Y = $(window).scrollTop();
		var is_slim_shady = $("#top-bar-shade").exists() && !$("html").hasClass("top-bar-box-shadow-none");
		if (Y < 0) return;
		var $top_bar = $("#top-bar");
		var rate = Number(Y / ($("#background-cover, [data-content=follow-scroll-opacity]").height() - $top_bar.height()));
		if (rate > 1) rate = 1;
		if (is_slim_shady) {
			if ($("#top-bar-shade").data("initial-opacity")) {
				rate += $("#top-bar-shade").data("initial-opacity");
			}
			$("#top-bar-shade").css({
				opacity: rate
			});
		}
		if (rate == 1) return;
		$("#background-cover-src").css({
			transform: "translate(0, " + Y * 0.8 + "px" + ")"
		});

	});

	// Selectable list items
	APP.fn.bindSelectableItems();

	// Image viewer page
	if ($("body#image").exists()) {

		// Data load detected
		if ($(APP.obj.image_viewer.selector + " [data-load=full]").length > 0) {

			$(document).on("click", APP.obj.image_viewer.loader, function (e) {
				APP.fn.viewerLoadImage();
			});

			if ($(APP.obj.image_viewer.loader).data("size") > APP.obj.config.image.load_max_filesize.getBytes()) {
				$(APP.obj.image_viewer.loader).css("display", "block");
			} else {
				APP.fn.viewerLoadImage();
			}

			// Fix viewer width when height changes and boom! a wild scrollbar appears
			$(document).bind("DOMSubtreeModified", function () {
				if ($("html").height() > $(window).innerHeight() && !$("html").hasClass("scrollbar-y")) {
					$("html").addClass("scrollbar-y");
					$(document).data({
						width: $(this).width(),
						height: $(this).height()
					});
					APP.fn.image_viewer_full_fix();
				}
			});

			$(window).on("resize", function () {
				APP.fn.image_viewer_full_fix();
			});

			// Viewer navigation
			$(document).on("keyup", function (e) {
				var $this = $(e.target),
					key = e.charCode || e.keyCode;
				if ($this.is(":input")) {
					return;
				} else {
					// Next 39, Prev 37
					if (APP.obj.image_viewer.$navigation.exists() && (key == 37 || key == 39)) {
						var navigation_jump_url = $("[data-action=" + (key == 37 ? "prev" : "next") + "]", APP.obj.image_viewer.$navigation).attr("href");
						if (typeof navigation_jump_url !== "undefined" && navigation_jump_url !== "") {
							window.location = $("[data-action=" + (key == 37 ? "prev" : "next") + "]", APP.obj.image_viewer.$navigation).attr("href");
						}
					}
				}
			});

		} else {
			APP.fn.viewerImageZoomClass();
		}

	}

	$(document).on("click", APP.obj.image_viewer.container, function (e) {

		if (!($(this).hasClass("cursor-zoom-in") || $(this).hasClass("cursor-zoom-out"))) return;

		var zoom_in = $(this).hasClass("cursor-zoom-in");

		$(this).removeClass("cursor-zoom-in cursor-zoom-out");

		if (zoom_in) {
			// We use getBoundingClientRect to get the not rounded value
			var width = $(this)[0].getBoundingClientRect().width,
				height = $(this)[0].getBoundingClientRect().height,
				ratio = $("img", this).attr("width") / $("img", this).attr("height"),
				new_width;

			if (typeof $(this).data("dimentions") == typeof undefined) {
				$(this).data({
					dimentions: {
						width: width,
						height: height
					},
					ratio: ratio
				});
			}

			if ($("img", this).attr("width") > $(window).width()) {
				$(this).css({
					width: "100%"
				});
				new_width = $(this).width();
				$(this).css({
					width: width
				});
			} else {
				new_width = $("img", this).attr("width");
			}

			$(this).addClass("cursor-zoom-out").css({
				width: new_width,
				height: (new_width / ratio) + "px"
			});

		} else {
			$(this).addClass("cursor-zoom-in").css($(this).data("dimentions"));
		}

		e.preventDefault();

	}).on("contextmenu", APP.obj.image_viewer.container, function (e) {
		if (!APP.obj.config.image.right_click) {
			e.preventDefault();
			return false;
		}
	});

	$(document).on("contextmenu", "html.device-mobile a.image-container", function (e) {
		e.preventDefault();
		return false;
	});

	$(document).on("keyup", "input[data-dashboard-tool]", function (e) {
		if (e.keyCode == 13) {
			var $button = $("[data-action=" + $(this).data("dashboard-tool") + "]");
			$button.click();
		}
	});

	$(document).on("click", "[data-action=dashboardTool]", function (e) {
		e.preventDefault();
		var tool = $(this).data("tool");
		var dataSet = $(this).data("data");
		var data = $.extend({}, dataSet);
		var inputs = {};
		for(var key in data) {
			var val = $(data[key]).val();
			if ($(data[key]).prop("disabled") || !val) {
				console.log(val)
				return;
			}
			inputs[key] = $(data[key]);
			data[key] = val;
		}
		data.action = tool;
		var ajaxObj = {
			type: "POST",
			cache: false,
		};
		ajaxObj.data = data;
		var $parent = $(this).closest(".input-label");
		var validate = true;
		var message;

		// 		if (!val.isEmail()) {
		// 			validate = false;
		// 			message = GO.fn._s("Please provide a valid email address");


		if (validate == false) {
			GO.fn.growl.expirable(message);
			return;
		}
		for(var key in inputs) {
			// inputs[key].prop("disabled", true);
		}
		GO.fn.loading.inline($('.loading', $parent), {
			size: "small",
			valign: "middle"
		});
		$parent.find(".btn .text").hide();
		$.ajax(ajaxObj)
			.complete(function (XHR) {
				var response = XHR.responseJSON;
				// inputs[key].prop("disabled", false);
				$('.loading', $parent).empty();
				$parent.find(".btn .text").show();
				GO.fn.growl.call(response[response.status_code == 200 ? "success" : "error"].message);
				if (response.status_code == 200 && typeof response.success.redirURL !== typeof undefined) {
					window.location.href = response.success.redirURL;
				}
			});
	});

	// Third-party plugin, magic comes in 3...
	$(document).on("click", "[data-action=openerPostMessage]", function (e) {
		if (!window.opener) return;
		e.preventDefault();
		var target_attr = "data-action-target";
		var $target = $($(this).is("[" + target_attr + "]") ? $(this).attr(target_attr) : this);
		var val = $target[$target.is(":input") ? "val" : "html"]();
		window.opener.postMessage({
			id: window.name,
			message: val
		}, "*");
	});

	/*
	// Input copy
	$(document).on("mouseenter mouseleave", ".input-copy", function(e){
		if(navigator.userAgent.match(/(iPad|iPhone|iPod)/i)) {
			return;
		}
		$(".btn-copy", this)[e.type == "mouseenter" ? "show" : "hide"]();
	});

	$(document).on("click", ".input-copy .btn-copy", function(){
		var $input = $(this).closest(".input-copy").find("input");
		$(this).hide();
		$input.highlight();
	});
	*/

	/**
	 * USER SIDE LISTING EDITOR
	 * -------------------------------------------------------------------------------------------------
	 */

	$(document).on("click", "[data-action=list-tools] [data-action]", function (e) {
		var $this = $(e.target),
			$list_item = $this.closest("[data-id]");
		if ($list_item && $list_item.find("[data-action=select]").exists() && (e.ctrlKey || e.metaKey) && e.altKey) {
			APP.fn.list_editor.toggleSelectItem($list_item, !$list_item.hasClass("selected"));
			e.preventDefault();
			e.stopPropagation();
		}
	});

	// On listing ajax, clear the "Clear selection" toggle
	GO.fn.listing.ajax.callback = function (XHR) {
		if (XHR.status !== 200) return;
		APP.fn.list_editor.listMassActionSet("select");
	};

	// Select all
	$(document).on("click", "[data-action=list-select-all]", function () {
		APP.fn.list_editor.selectItem($(".list-item:visible:not(.selected)"));
		APP.fn.list_editor.listMassActionSet("clear");
	});
	// Clear all
	$(document).on("click", "[data-action=list-clear-all]", function () {
		GO.fn.close_pops();
		APP.fn.list_editor.clearSelection();
	});

	// List item tools action (single)
	$(document).on("click", "[data-action=list-tools] [data-action]", function (e) {

		if (e.isPropagationStopped()) return false;

		var $list_item = $(this).closest(GO.obj.listing.selectors.list_item + ", .viewer");
		var id = $list_item.data("id");

		if (typeof $list_item.data("type") !== "undefined") {
			dealing_with = $list_item.data("type");
		} else {
			console.log("Error: data-type not defined");
			return;
		}

		var $targets = $("[data-type=" + dealing_with + "][data-id=" + id + "]");
		var $this_icon, this_add_class, this_remove_class, this_label_text, dealing_with;

		switch ($(this).data("action")) {

			case "select":
				APP.fn.list_editor.toggleSelectItem($list_item, !$list_item.hasClass("selected"));
				break;

			case "edit":

				var modal_source = "[data-modal=form-edit-single]";

				// Populate the modal before casting it
				switch (dealing_with) {
					case "image":
						$("[name=form-image-title]", modal_source).attr("value", $list_item.data("title"));
						$("[name=form-image-description]", modal_source).html(GO.fn.htmlEncode($list_item.data("description")));

						$("[name=form-album-id]", modal_source).find("option").removeAttr("selected");
						$("[name=form-album-id]", modal_source).find("[value=" + $list_item.data(dealing_with == "image" ? "album-id" : "id") + "]").attr("selected", true);

						$("[name=form-category-id]", modal_source).find("option").removeAttr("selected");
						$("[name=form-category-id]", modal_source).find("[value=" + $list_item.data("category-id") + "]").attr("selected", true);

						$("[name=form-nsfw]", modal_source).attr("checked", $list_item.data("flag") == "unsafe");

						// Just in case...
						$("[name=form-album-name]", modal_source).attr("value", "");
						$("[name=form-album-description]", modal_source).html("");
						$("[name=form-privacy]", modal_source).find("option").removeAttr("selected");

						break;
					case "album":
						$("[data-action=album-switch]", modal_source).remove();
						$("[name=form-album-name]", modal_source).attr("value", $list_item.data("name"));
						$("[name=form-album-description]", modal_source).html(GO.fn.htmlEncode($list_item.data("description")));
						$("[name=form-privacy]", modal_source).find("option").removeAttr("selected");
						$("[name=form-privacy]", modal_source).find("[value=" + $list_item.data("privacy") + "]").attr("selected", true);
						if ($list_item.data("privacy") == 'password') {
							$("[data-combo-value=password]").show();
							$("[name=form-album-password]", modal_source).attr("value", $list_item.data("password"));
						} else {
							$("[data-combo-value=password]").hide();
							$("[name=form-album-password]", modal_source).attr("value", "");
						}
						break;
				}

				GO.fn.modal.call({
					type: "html",
					template: $(modal_source).html(),
					ajax: {
						url: GO.obj.config.json_api,
						deferred: {
							success: function (XHR) {
								APP.fn.list_editor.updateItem("[data-type=" + dealing_with + "][data-id=" + id + "]", XHR.responseJSON[dealing_with], "edit");
							}
						}
					},
					confirm: function () {

						var $modal = $(GO.obj.modal.selectors.root);

						if ((dealing_with == "image" || dealing_with == "album") && $("[data-content=form-new-album]", $modal).is(":visible") && $("[name=form-album-name]", $modal).val() == "") {
							GO.fn.growl.call(GO.fn._s("You must enter the album name."));
							$("[name=form-album-name]", $modal).highlight();
							return false;
						}

						if (!GO.fn.form_modal_has_changed()) {
							GO.fn.modal.close();
							return;
						}

						GO.obj.modal.form_data = {
							action: "edit", // use the same method applied in viewer
							edit: $list_item.data("type"),
							single: true,
							owner: APP.obj.resource.user.id,
							editing: {
								id: id,
								description: $("[name=form-" + dealing_with + "-description]", $modal).val()
							}
						};

						switch (dealing_with) {
							case "image":
								GO.obj.modal.form_data.editing.title = $("[name=form-image-title]", $modal).val();
								GO.obj.modal.form_data.editing.category_id = $("[name=form-category-id]", $modal).val() || null;
								GO.obj.modal.form_data.editing.nsfw = $("[name=form-nsfw]", $modal).prop("checked") ? 1 : 0;
								break;
							case "album":
								GO.obj.modal.form_data.editing.name = $("[name=form-album-name]", $modal).val();
								GO.obj.modal.form_data.editing.privacy = $("[name=form-privacy]", $modal).val();
								if (GO.obj.modal.form_data.editing.privacy == "password") {
									GO.obj.modal.form_data.editing.password = $("[name=form-album-password]", $modal).val();
								}
								break;
						}

						GO.obj.modal.form_data.editing.new_album = $("[data-content=form-new-album]", $modal).is(":visible");

						if (GO.obj.modal.form_data.editing.new_album) {
							GO.obj.modal.form_data.editing.album_name = $("[name=form-album-name]", $modal).val();
							GO.obj.modal.form_data.editing.album_privacy = $("[name=form-privacy]", $modal).val();
							if (GO.obj.modal.form_data.editing.album_privacy == "password") {
								GO.obj.modal.form_data.editing.album_password = $("[name=form-album-password]", $modal).val();
							}
							GO.obj.modal.form_data.editing.album_description = $("[name=form-album-description]", $modal).val();
						} else {
							GO.obj.modal.form_data.editing.album_id = $("[name=form-album-id]", $modal).val();
						}

						return true;
					}
				});
				break;

			case "move": // Move or create album

				var modal_source = "[data-modal=form-move-single]";

				// Fool the selected album
				$("[name=form-album-id]", modal_source).find("option").removeAttr("selected");
				$("[name=form-album-id]", modal_source).find("[value=" + $list_item.data(dealing_with == "image" ? "album-id" : "id") + "]").attr("selected", true);

				// Just in case...
				$("[name=form-album-name]", modal_source).attr("value", "");
				$("[name=form-album-description]", modal_source).html("");
				$("[name=form-privacy]", modal_source).find("option").removeAttr("selected");

				GO.fn.modal.call({
					type: "html",
					template: $(modal_source).html(),
					ajax: {
						url: GO.obj.config.json_api,
						deferred: {
							success: function (XHR) {
								APP.fn.list_editor.updateMoveItemLists(XHR.responseJSON, dealing_with, $targets);
							}
						}
					},
					load: function () {
						//$("[name=form-album-id]", GO.obj.modal.selectors.root).focus();
					},
					confirm: function () {

						var $modal = $(GO.obj.modal.selectors.root);

						if ($("[data-content=form-new-album]", $modal).is(":visible") && $("[name=form-album-name]", $modal).val() == "") {
							GO.fn.growl.call(GO.fn._s("You must enter the album name."));
							$("[name=form-album-name]", $modal).highlight();
							return false;
						}

						if (!GO.fn.form_modal_has_changed()) {
							GO.fn.modal.close();
							return;
						}

						GO.obj.modal.form_data = {
							action: "edit", // use the same method applied in viewer
							edit: $list_item.data("type"),
							single: true,
							owner: APP.obj.resource.user.id,
							editing: {
								id: id
							}
						};

						GO.obj.modal.form_data.editing.new_album = $("[data-content=form-new-album]", $modal).is(":visible");

						if (GO.obj.modal.form_data.editing.new_album) {
							GO.obj.modal.form_data.editing.album_name = $("[name=form-album-name]", $modal).val();
							GO.obj.modal.form_data.editing.album_privacy = $("[name=form-privacy]", $modal).val();
							if (GO.obj.modal.form_data.editing.album_privacy == "password") {
								GO.obj.modal.form_data.editing.album_password = $("[name=form-album-password]", $modal).val();
							}
							GO.obj.modal.form_data.editing.album_description = $("[name=form-album-description]", $modal).val();
						} else {
							GO.obj.modal.form_data.editing.album_id = $("[name=form-album-id]", $modal).val();
						}

						return true;

					}
				});

				break;

			case "delete":

				GO.fn.modal.call({
					type: "html",
					template: $("[data-modal=form-delete-single]").html(),
					button_submit: GO.fn._s("Confirm"),
					ajax: {
						url: GO.obj.config.json_api,
						deferred: {
							success: function (XHR) {
								if (dealing_with == "album") {
									$("[name=form-album-id]", "[data-modal]").find("[value=" + id + "]").remove();
									APP.fn.list_editor.updateUserCounters("image", XHR.responseJSON.success.affected, "-");
								}

								APP.fn.list_editor.deleteFromList($list_item);
								APP.fn.queuePixel();
							}
						}
					},
					confirm: function () {
						GO.obj.modal.form_data = {
							action: "delete",
							single: true,
							delete: $list_item.data("type"),
							deleting: {
								id: id
							}
						};
						return true;
					}
				});

				break;

			case "flag":
				$.ajax({
					type: "POST",
					data: {
						action: 'edit',
						edit: 'image',
						single: true,
						editing: {
							id: id,
							nsfw: $list_item.data("flag") == "unsafe" ? 0 : 1
						}
					}
				}).complete(function (XHR) {
					var response = XHR.responseJSON;
					var flag = response.image.nsfw == 1 ? "unsafe" : "safe";
					$targets.attr("data-flag", flag).data("flag", flag);
					// Remember me gansito
					APP.fn.list_editor.selectionCount();
				});
				break;

		}

	});

	// Item action (multiple)
	$(".pop-box-menu a", "[data-content=list-selection]").click(function (e) {

		var $content_listing = $(GO.obj.listing.selectors.content_listing_visible);

		if (typeof $content_listing.data("list") !== "undefined") {
			dealing_with = $content_listing.data("list");
		} else {
			console.log("Error: data-list not defined");
			return;
		}

		var $targets = $(GO.obj.listing.selectors.list_item + ".selected", $content_listing),
			ids = $.map($targets, function (e, i) {
				return $(e).data("id");
			});

		$(this).closest(".pop-btn").click();

		switch ($(this).data("action")) {

			case "get-embed-codes":

				// Prepare the HTML
				var template = "[data-modal=form-embed-codes]";
				var objects = [];

				$("textarea", template).html("");

				// Build the object
				$targets.each(function () {
					var aux = {
						image: $.parseJSON(decodeURIComponent($(this).data("object")))
					};
					if('url' in aux.image) {
						objects.push(aux);
					}					
				});

				console.log(objects)

				APP.fn.fillEmbedCodes(objects, template, "html");

				GO.fn.modal.call({
					type: "html",
					template: $(template).html(),
					buttons: false
				});

				break;

			case "clear":
				APP.fn.list_editor.clearSelection();
				e.stopPropagation();
				break;

			case "move":
			case "create-album":

				var template = $(this).data("action") == "move" ? "form-move-multiple" : "form-create-album",
					modal_source = "[data-modal=" + template + "]",
					dealing_id_data = (/image/.test(dealing_with) ? "album-id" : "id");

				$("[name=form-album-id]", modal_source).find("[value=null]").remove();

				// Fool the album selection
				$("[name=form-album-id]", modal_source).find("option").removeAttr("selected");

				// Just in case...
				$("[name=form-album-name]", modal_source).attr("value", "");
				$("[name=form-album-description]", modal_source).html("");
				$("[name=form-privacy]", modal_source).find("option").removeAttr("selected");

				// This is an extra step...
				var album_id = $targets.first().data(dealing_id_data),
					same_album = true;

				$targets.each(function () {
					if ($(this).data(dealing_id_data) !== album_id) {
						same_album = false;
						return false;
					}
				});

				if (!same_album) {
					$("[name=form-album-id]", modal_source).prepend('<option value="null">' + GO.fn._s('Select existing album') + '</option>');
				}

				$("[name=form-album-id]", modal_source).find("[value=" + (same_album ? $targets.first().data(dealing_id_data) : "null") + "]").attr("selected", true);

				GO.fn.modal.call({
					type: "html",
					template: $(modal_source).html(),
					ajax: {
						url: GO.obj.config.json_api,
						deferred: {
							success: function (XHR) {
								APP.fn.list_editor.updateMoveItemLists(XHR.responseJSON, dealing_with, $targets);
							}
						}
					},
					load: function () {
						if (template == "form-move-multiple") {
							//$("[name=form-album-id]", GO.obj.modal.selectors.root).focus();
						}
					},
					confirm: function () {

						var $modal = $(GO.obj.modal.selectors.root),
							new_album = false;

						if ($("[data-content=form-new-album]", $modal).is(":visible") && $("[name=form-album-name]", $modal).val() == "") {
							GO.fn.growl.call(GO.fn._s("You must enter the album name."));
							$("[name=form-album-name]", $modal).highlight();
							return false;
						}

						if ($("[data-content=form-new-album]", $modal).is(":visible")) {
							new_album = true;
						}

						if (!GO.fn.form_modal_has_changed()) {
							GO.fn.modal.close();
							return;
						}

						var album_object = new_album ? "creating" : "moving";

						GO.obj.modal.form_data = {
							action: new_album ? "create-album" : "move",
							type: dealing_with,
							owner: APP.obj.resource.user.id,
							multiple: true,
							album: {
								ids: ids,
								"new": new_album
							}
						};

						if (new_album) {
							GO.obj.modal.form_data.album.name = $("[name=form-album-name]", $modal).val();
							GO.obj.modal.form_data.album.privacy = $("[name=form-privacy]", $modal).val();
							if (GO.obj.modal.form_data.album.privacy == "password") {
								GO.obj.modal.form_data.album.password = $("[name=form-album-password]", $modal).val();
							}
							GO.obj.modal.form_data.album.description = $("[name=form-album-description]", $modal).val();
						} else {
							GO.obj.modal.form_data.album.id = $("[name=form-album-id]", $modal).val();
						}

						return true;

					}
				});

				break;

			case "delete":

				GO.fn.modal.call({
					template: $("[data-modal=form-delete-multiple]").html(),
					button_submit: GO.fn._s("Confirm"),
					ajax: {
						url: GO.obj.config.json_api,
						deferred: {
							success: function (XHR) {
								// unificar
								if (dealing_with == "albums") {
									$targets.each(function () {
										$("[name=form-album-id]", "[data-modal]").find("[value=" + $(this).data("id") + "]").remove();
									});
									APP.fn.list_editor.updateUserCounters("image", XHR.responseJSON.success.affected, "-");
								}
								APP.fn.list_editor.deleteFromList($targets);
								APP.fn.queuePixel();
							}
						}
					},
					confirm: function () {

						GO.obj.modal.form_data = {
							action: "delete",
							from: "list",
							"delete": dealing_with,
							multiple: true,
							deleting: {
								ids: ids
							}
						};

						return true;
					}
				});

				break;

			case "assign-category":

				var category_id = $targets.first().data("category-id"),
					same_category = true;

				$targets.each(function () {
					if ($(this).data("category-id") !== category_id) {
						same_category = false;
						return false;
					}
				});

				GO.fn.modal.call({
					type: "html",
					template: $("[data-modal=form-assign-category]").html(),
					forced: true,
					ajax: {
						url: GO.obj.config.json_api,
						deferred: {
							success: function (XHR) {
								$targets.each(function () {
									var response = XHR.responseJSON;
									$(this).data("category-id", response.category_id);
								});
								APP.fn.list_editor.clearSelection();
							}
						}
					},
					confirm: function () {
						var $modal = $(GO.obj.modal.selectors.root),
							form_category = $("[name=form-category-id]", $modal).val() || null;

						if (same_category && category_id == form_category) {
							GO.fn.modal.close(function () {
								APP.fn.list_editor.clearSelection();
							});
							return false;
						}

						GO.obj.modal.form_data = {
							action: "edit-category",
							from: "list",
							multiple: true,
							editing: {
								ids: ids,
								category_id: form_category
							}
						};
						return true;
					}
				});
				break;

			case "flag-safe":
			case "flag-unsafe":

				var action = $(this).data("action"),
					flag = action == "flag-safe" ? "safe" : "unsafe";

				GO.fn.modal.call({
					template: $("[data-modal=form-" + action + "]").html(),
					button_submit: GO.fn._s("Confirm"),
					ajax: {
						url: GO.obj.config.json_api,
						deferred: {
							success: function (XHR) {
								$targets.each(function () {
									$(this).removeClass("safe unsafe").addClass(flag).removeAttr("data-flag").attr("data-flag", flag).data("flag", flag);
								});
								APP.fn.list_editor.clearSelection();
							}
						}
					},
					confirm: function () {
						GO.obj.modal.form_data = {
							action: action,
							from: "list",
							multiple: true,
							editing: {
								ids: ids,
								nsfw: action == "flag-safe" ? 0 : 1
							}
						};

						return true;
					}
				});

				break;
		}

		if (GO.fn.isDevice(["phone", "phablet"])) {
			return false;
		}

	});

	// Image page
	if ($("body#image").exists()) {
		$(window).scroll(function () {
			APP.obj.topBar.transparencyScrollToggle();
		});
	}

	$(document).on("click", "[data-action=disconnect]", function () {
		var $this = $(this),
			connection = $this.data("connection");

		GO.fn.modal.confirm({
			message: $this.data("confirm-message"),
			ajax: {
				data: {
					action: 'disconnect',
					disconnect: connection,
					user_id: APP.obj.resource.user.id
				},
				deferred: {
					success: function (XHR) {
						var response = XHR.responseJSON;
						$("[data-connection=" + connection + "]").fadeOut(function () {
							$($("[data-connect=" + connection + "]")).fadeIn();
							$(this).remove();
							if ($("[data-connection]").length == 0) {
								$("[data-content=empty-message]").show();
							}
							GO.fn.growl.expirable(response.success.message);
						});
					},
					error: function (XHR) {
						var response = XHR.responseJSON;
						GO.fn.growl.call(response.error.message);
					}
				}
			}
		});
	});

	$(document).on("click", "[data-action=delete-avatar]", function () {
		var $parent = $(".user-settings-avatar"),
			$loading = $(".loading-placeholder", $parent),
			$top = $("#top-bar");

		$loading.removeClass("hidden");

		GO.fn.loading.inline($loading, {
			center: true
		});

		$.ajax({
			type: "POST",
			data: {
				action: "delete",
				delete: "avatar",
				owner: APP.obj.resource.user.id
			}
		}).complete(function (XHR) {
			$loading.addClass("hidden").empty();
			if (XHR.status == 200) {
				if (APP.obj.logged_user.id == APP.obj.resource.user.id) {
					$("img.user-image", $top).hide();
					$(".default-user-image", $top).removeClass("hidden");
				}
				$(".default-user-image", $parent).removeClass("hidden").css({
					opacity: 0
				});
				$(".btn-alt", $parent).closest("div").hide();
				$("img.user-image", $parent).fadeOut(function () {
					$(".default-user-image", $parent).animate({
						opacity: 1
					});
				});
			} else {
				GO.fn.growl.expirable(GO.fn._s("An error occurred. Please try again later."));
			}
		});

	});

	$(document).on("change", "[data-content=user-avatar-upload-input]", function (e) {

		e.preventDefault();
		e.stopPropagation();

		var $this = $(this),
			$parent = $(".user-settings-avatar"),
			$loading = $(".loading-placeholder", ".user-settings-avatar"),
			$top = $("#top-bar"),
			user_avatar_file = $(this)[0].files[0];

		if ($this.data("uploading")) {
			return;
		}

		if (/^image\/.*$/.test(user_avatar_file.type) == false) {
			GO.fn.growl.call(GO.fn._s("Please select a valid image file type."));
			return;
		}

		if (user_avatar_file.size > APP.obj.config.user.avatar_max_filesize.getBytes()) {
			GO.fn.growl.call(GO.fn._s("Please select a picture of at most %s size.", APP.obj.config.user.avatar_max_filesize));
			return;
		}

		$loading.removeClass("hidden");

		GO.fn.loading.inline($loading, {
			center: true
		});

		$this.data("uploading", true);

		// HTML5 method
		var user_avatar_fd = new FormData();

		user_avatar_fd.append("source", user_avatar_file);
		user_avatar_fd.append("action", "upload");
		user_avatar_fd.append("type", "file");
		user_avatar_fd.append("what", "avatar");
		user_avatar_fd.append("owner", APP.obj.resource.user.id);
		user_avatar_fd.append("auth_token", GO.obj.config.auth_token);

		avatarXHR = new XMLHttpRequest();
		avatarXHR.open("POST", GO.obj.config.json_api, true);
		avatarXHR.send(user_avatar_fd);
		avatarXHR.onreadystatechange = function () {
			if (this.readyState == 4) {
				var response = this.responseType !== "json" ? JSON.parse(this.response) : this.response,
					image = response.success.image;

				$loading.addClass("hidden").empty();

				if (this.status == 200) {
					change_avatar = function (parent) {
						$("img.user-image", parent).attr("src", image.url).removeClass("hidden").show();
					};
					hide_default = function (parent) {
						$(".default-user-image", parent).addClass("hidden");
					};

					// Form
					hide_default($parent);
					$(".btn-alt", $parent).closest("div").show();
					change_avatar($parent);
					// Top
					if (APP.obj.logged_user.id == APP.obj.resource.user.id) {
						change_avatar($top);
						hide_default($top);
					}
					GO.fn.growl.expirable(GO.fn._s("Profile image updated."));
				} else {
					GO.fn.growl.expirable(GO.fn._s("An error occurred. Please try again later."));
				}

				$this.data("uploading", false);
			}

		};
	});

	$(document).on("change", "[data-content=user-background-upload-input]", function (e) {

		e.preventDefault();
		e.stopPropagation();

		var $this = $(this),
			$parent = $("[data-content=user-background-cover]"),
			$src = $("[data-content=user-background-cover-src]"),
			$loading = $(".loading-placeholder", $parent),
			$top = $("#top-bar"),
			user_file = $(this)[0].files[0];

		if ($this.data("uploading")) {
			return;
		}

		if (/^image\/.*$/.test(user_file.type) == false) {
			GO.fn.growl.call(GO.fn._s("Please select a valid image file type."));
			return;
		}

		if (user_file.size > APP.obj.config.user.background_max_filesize.getBytes()) {
			GO.fn.growl.call(GO.fn._s("Please select a picture of at most %s size.", APP.obj.config.user.background_max_filesize));
			return;
		}

		$loading.removeClass("hidden");

		GO.fn.loading.inline($loading, {
			center: true,
			size: 'big',
			color: '#FFF'
		});

		$this.data("uploading", true);

		// HTML5 method
		var user_picture_fd = new FormData();

		user_picture_fd.append("source", user_file);
		user_picture_fd.append("action", "upload");
		user_picture_fd.append("type", "file");
		user_picture_fd.append("what", "background");
		user_picture_fd.append("owner", APP.obj.resource.user.id);
		user_picture_fd.append("auth_token", GO.obj.config.auth_token);

		avatarXHR = new XMLHttpRequest();
		avatarXHR.open("POST", GO.obj.config.json_api, true);
		avatarXHR.send(user_picture_fd);
		avatarXHR.onreadystatechange = function () {
			if (this.readyState == 4) {
				var response = this.responseType !== "json" ? JSON.parse(this.response) : this.response,
					image = response.success.image;

				if (this.status == 200) {
					var $img = $("<img/>");
					$img.attr('src', image.url).imagesLoaded(function () {
						$loading.addClass("hidden").empty();
						$src.css("background-image", "url(" + image.url + ")").hide().fadeIn();
						$("[data-content=user-change-background]", $parent).removeClass("hidden");
						$parent.removeClass("no-background");
						$("[data-content=user-upload-background]").hide();
						$("[data-content=user-change-background]").show();
						GO.fn.growl.expirable(GO.fn._s("Profile background image updated."));
						$img.remove();
						if (typeof user_background_full_fix == "function") {
							user_background_full_fix();
							//GO.fn.follow_scroll_update();
						}
					});

				} else {
					$loading.addClass("hidden").empty();
					GO.fn.growl.expirable(GO.fn._s("An error occurred. Please try again later."));
				}

				$this.data("uploading", false);
			}

		};
	});

	APP.fn.user_background = {
		delete: {
			submit: function () {
				GO.obj.modal.form_data = {
					action: "delete",
					delete: "background",
					owner: APP.obj.resource.user.id
				};
				return true;
			},
			deferred: {
				success: {
					before: function (XHR) {
						$("[data-content=user-background-cover-src]").css("background-image", "none");
						$("[data-content=user-background-cover]").addClass("no-background").height("");
						$("[data-content=user-upload-background]").removeClass("hidden").show();
						$("[data-content=user-change-background]").hide();
						$("#top-bar").removeClass("transparent background-transparent");
						$("#top-bar-shade").remove();
						//GO.fn.follow_scroll_update();
					},
					done: function (XHR) {
						GO.fn.modal.close(function () {
							GO.fn.growl.expirable(GO.fn._s("Profile background image deleted."));
						});
					}
				},
				error: function (XHR) {
					GO.fn.growl.expirable(GO.fn._s("Error deleting profile background image."));
				}
			}
		}
	};

	// Form things
	APP.str.mainform = "[data-content=main-form]";
	APP.obj.timezone = {
		'selector': "[data-content=timezone]",
		'input': "#timezone-region"
	};

	// Detect form changes
	$(document).on("keyup change", APP.str.mainform + " :input", function () {
		if ($(this).is("[name=username]")) {
			$("[data-text=username]").text($(this).val());
		}
	});

	// Timezone handler
	$(document).on("change", APP.obj.timezone.input, function () {
		var value = $(this).val(),
			$timezone_combo = $("#timezone-combo-" + value);
		$timezone_combo.find("option:first").prop("selected", true);
		$(APP.obj.timezone.selector).val($timezone_combo.val()).change();
	});
	$(document).on("change", "[id^=timezone-combo-]", function () {
		var value = $(this).val();
		$(APP.obj.timezone.selector).val(value).change();
	});

	// Password match
	$(document).on("keyup change blur", "[name^=new-password]", function () {
		var $new_password = $("[name=new-password]"),
			$new_password_confirm = $("[name=new-password-confirm]"),
			hide = $new_password.val() == $new_password_confirm.val(),
			$warning = $new_password_confirm.closest(".input-password").find(".input-warning");

		if ($(this).is($new_password_confirm)) {
			$new_password_confirm.data("touched", true);
		}

		if ($new_password_confirm.data("touched")) {
			$warning.text(!hide ? $warning.data("text") : "")[!hide ? 'removeClass' : 'addClass']('hidden-visibility');
		}
	});

	// Submit form
	$(document).on("submit", APP.obj.mainform, function () {
		switch ($(this).data("type")) {
			case "password":
				var $p1 = $("[name=new-password]", this),
					$p2 = $("[name=new-password-confirm]", this);
				if ($p1.val() !== "" || $p2.val() !== "") {
					if ($p1.val() !== $p2.val()) {
						$p1.highlight();
						$p2.highlight();
						GO.fn.growl.expirable(GO.fn._s("Passwords don't match"));
						return false;
					}
				}
				break;
		}
	});

	$(document).on("change", "[name=theme_tone]", function () {
		$("html")[0].className = $("html")[0].className.replace(/\btone-[\w-]+\b/g, '');
		$("html").addClass("tone-" + $(this).val());
	});
	$(document).on("change", "[name=theme_top_bar_color]", function () {
		//$("html")[0].className = $("html")[0].className.replace(/\btone-[\w-]+\b/g, '');
		$("#top-bar, .top-bar").removeClass("black white").addClass($(this).val());
	});

	$(document).on("click", "[data-action=check-for-updates]", function () {
		GO.fn.loading.fullscreen();
		APP.fn.system.checkUpdates(function (XHR) {
			GO.fn.loading.destroy("fullscreen");

			if (XHR.status !== 200) {
				GO.fn.growl.call(GO.fn._s("An error occurred. Please try again later."));
				return;
			}

			var data = XHR.responseJSON.software;

			if (GO.fn.versionCompare(APP.obj.system_info.version, data.current_version) == -1) {
				GO.fn.modal.simple({
					title: GO.fn._s("Update available v%s", data.current_version),
					message: '<p>' + GO.fn._s('There is an update available for your system. You can automatic download and install this update or go to %s to proceed to download the file.', '<a href="' + GOCORE.source.url + '" target="_blank">' + GOCORE.source.label + '</a>') + '<p>' + GO.fn._s('The release notes for this update are:') + '</p>' + '<textarea class="r4 resize-vertical">' + data.release_notes + '</textarea>' + '<div class="btn-container margin-bottom-0"><a href="' + GO.obj.config.base_url + '/update' + '" class="btn btn-input default">' + GO.fn._s('Update now') + '</a> <span class="btn-alt">' + GO.fn._s('or') + ' <a data-action="cancel">' + GO.fn._s('cancel') + '</a></span></div>',
					html: true
				});
			} else {
				GO.fn.growl.call(GO.fn._s("This website is running latest %s version", GOCORE.edition));
			}

		});
	});

	if (typeof GO.fn.get_url_var("checkUpdates") !== typeof undefined) {
		$("[data-action=check-for-updates]").click();
	}

	// Topbar native js thing
	if ($("body#image").exists() && window.scrollY > 0) {
		$("#top-bar").removeClass("transparent");
	}

	// Storage form
	$(document).on("click", "[data-action=toggle-storage-https]", function () {
		APP.fn.storage.toggleHttps($(this).closest("[data-content=storage]").data('storage-id'));
	});
	$(document).on("click", "[data-action=toggle-storage-active]", function () {
		APP.fn.storage.toggleActive($(this).closest("[data-content=storage]").data('storage-id'));
	});

	// Detect paste image event
	if ($(APP.fn.uploader.selectors.root).exists()) {

		APP.fn.uploader.$pasteCatcher = $("<div />", {
			contenteditable: "true",
			id: APP.fn.uploader.selectors.paste.replace(/#/, "")
		});
		$("body").append(APP.fn.uploader.$pasteCatcher);

		// Hack Ctrl/Cmd+V to focus pasteCatcher
		$(document).keydown(function (e) {
			var key = e.keyCode;
			var ctrlDown = e.ctrlKey || e.metaKey; // Mac support
			if (ctrlDown && key == 86 && !$(e.target).is(":input")) { // Paste detected on "body"
				APP.fn.uploader.$pasteCatcher.focus();
			}
		});
		// Add the paste event listener
		window.addEventListener("paste", APP.fn.uploader.pasteImageHandler);
	}

	/* LIKE BUTTON */
	$(document).on("click", "[data-action=like]", function () {

		if (!GO.fn.is_user_logged()) {
			GO.fn.modal.call({
				type: "login"
			});
			return;
		}

		var $this = $(this);
		// Block ajax while this thing is still working...
		if ($this.data("XHR")) return;
		$this.data("XHR", true);

		var $object = $(this).is("[data-liked]") ? $(this) : $(this).closest("[data-liked]");
		var isSingle = !$object.closest("[data-list], .viewer").exists() && typeof APP.obj.resource !== typeof undefined;
		var liked = $object.is("[data-liked=1]");
		var action = !liked ? 'like' : 'dislike';
		var content = {
			id: isSingle ? APP.obj.resource.id : $(this).closest("[data-id]").attr("data-id"),
			type: isSingle ? APP.obj.resource.type : $(this).closest("[data-type]").attr("data-type")
		};
		var $targets = isSingle ? $this : $("[data-type=" + content.type + "][data-id=" + content.id + "]");
		var ajax = {
			type: "POST",
			data: {
				action: action
			},
			cache: false
		};
		ajax.data[action] = {
			object: content.type,
			id: content.id,
		};
		$.ajax(ajax)
			.complete(function (XHR) {
				var response = XHR.responseJSON;
				$this.data("XHR", false);
				if (response.status_code !== 200) {
					GO.fn.growl.expirable(GO.fn._s("An error occurred. Please try again later."));
					return;
				}
				if (isSingle && typeof response.content !== typeof undefined) {
					$("[data-text=likes-count]").html(response.content.likes);
				}
				$targets.attr("data-liked", liked ? 0 : 1); // Toggle indicator
			});

	});

	/* FOLLOW BUTTON */
	$(document).on("click", "[data-action=follow]", function () {

		if (!GO.fn.is_user_logged()) {
			GO.fn.modal.call({
				type: "login"
			});
			return;
		}

		var $this = $(this);
		// Block ajax while this thing is still working...
		if ($this.data("XHR")) return;
		$this.data("XHR", true);

		var $object = $(this).is("[data-followed]") ? $(this) : $(this).closest("[data-followed]");
		var isSingle = typeof APP.obj.resource !== typeof undefined;
		var followed = $object.is("[data-followed=1]");
		var action = !followed ? 'follow' : 'unfollow';
		var content = {
			id: isSingle ? APP.obj.resource.id : $(this).closest("[data-id]").data("id"),
			type: isSingle ? APP.obj.resource.type : $(this).closest("[data-type]").data("type")
		};
		var ajax = {
			type: "POST",
			data: {
				action: action
			},
			cache: false
		};
		ajax.data[action] = {
			object: content.type,
			id: content.id,
		};
		$.ajax(ajax)
			.complete(function (XHR) {
				var response = XHR.responseJSON;
				$this.data("XHR", false);
				if (response.status_code !== 200) {
					GO.fn.growl.expirable(GO.fn._s("An error occurred. Please try again later."));
					return;
				}
				if (isSingle) {
					if (typeof response.user_followed !== typeof undefined) {
						var $followersLabel = $("[data-text=followers-label]");
						var label = {
							single: $followersLabel.data('label-single'),
							plural: $followersLabel.data('label-plural')
						};
						$("[data-text=followers-count]").html(response.user_followed.followers);
						$followersLabel.html(GO.fn._n(label.single, label.plural, response.user_followed.followers));
					}
				}
				$object.attr("data-followed", followed ? 0 : 1); // Toggle indicator
			});
	});

	// Notifications antiscroll. Must be called on visible elements.
	function notifications_scroll() {
		if (GO.fn.isDevice(["phone", "phablet"])) return;
		var $visible_list = $(".top-bar-notifications-list ul", ".top-bar:visible");
		var height;
		var height_auto;
		$visible_list.css("height", ""); // Reset any change
		height = $visible_list.height();
		$visible_list.data("height", height).css("height", "auto");
		height_auto = $visible_list.height();
		if (height_auto > height) {
			$visible_list.height(height);
			$visible_list.closest(".antiscroll-wrap").antiscroll();
		}
	}

	// Notifications list
	$(document).on("click", "[data-action=top-bar-notifications]", function (e) {
		var _this = this;
		var $this = $(this);

		var $container = $(".top-bar-notifications-container", $this);
		var $list = $(".top-bar-notifications-list", $this);
		var $ul = $("ul", $list);
		var $loading = $(".loading", $container);

		if ($this.data("XHR")) {
			return;
		} else {
			$loading.removeClass("hidden");
			GO.fn.loading.inline($loading, {
				size: "small",
				message: GO.fn._s("loading")
			});
		}

		$.ajax({
				type: "POST",
				data: {
					action: "notifications"
				},
				cache: false
			})
			.complete(function (XHR) {
				var response = XHR.responseJSON;
				if (response.status_code !== 200) {
					GO.fn.growl.expirable(GO.fn._s("An error occurred. Please try again later."));
					$this.data("XHR", false);
					$loading.addClass("hidden").html("");
					return;
				}
				$this.data("XHR", true);
				$loading.remove();
				if (!response.html) {
					$(".empty", $container).removeClass("hidden");
					return;
				}
				$list.removeClass("hidden");
				$ul.html(response.html);
				notifications_scroll();
				var $li = $("li.new", $ul);
				$li.addClass("transition");
				setTimeout(function () {
					$li.removeClass("new");
					$("[data-content=notifications-counter]", _this).removeClass("on").html("0");
					setTimeout(function () {
						$li.removeClass("transition");
					}, 150);
				}, 1500);
			});
	});

	// Invoke reCaptcha
	if ($("#g-recaptcha").is(':empty') && APP.obj.config.recaptcha.enabled && APP.obj.config.recaptcha.sitekey) {
		reCaptchaCallback = function () {
			grecaptcha.render("g-recaptcha", {
				sitekey: APP.obj.config.recaptcha.sitekey,
			});
		};
		$.getScript("https://www.google.com/recaptcha/api.js?onload=reCaptchaCallback&render=explicit");
	}

	$(document).on("click", ".list-item a.image-container", function (e) {
		var $parent = $(this).closest(".list-item");
		var $loadBtn = $parent.find("[data-action=load-image]");
		if ($loadBtn.length > 0) {
			loadImageListing($loadBtn);
			e.preventDefault();
		}
		return;
	});

	// Load image from listing
	$(document).on("click", ".list-item [data-action=load-image]", function (e) {
		loadImageListing($(this));
		e.preventDefault();
		e.stopPropagation();
		return;
	});

	function loadImageListing($this) {
		$this.addClass("list-item-play-gif--loading");
		var $parent = $this.closest(".list-item");
		var $imageContainer = $(".image-container", $parent);
		var $image = $("img", $imageContainer);
		var md = ".md";
		var imageSrc = $image.attr("src");
		var mdIndex = imageSrc.lastIndexOf(md);
		var loadSrc = imageSrc.substr(0, mdIndex) + imageSrc.substr(mdIndex + md.length, imageSrc.length);
		$imageContainer.append($imageContainer.html());
		$load = $parent.find(".image-container img").eq(1).attr("src", loadSrc).addClass("hidden");
		$load.imagesLoaded(function () {
			$this.remove();
			$image.remove();
			$(this.elements).removeClass("hidden");
		});
	}

	$(document).on("click", "#album [data-tab=tab-codes]", function () {
		if (!GO.fn.is_user_logged()) {
			return;
		}
		var $loading = $(".content-listing-loading", "#tab-codes");
		if (!$loading.exists()) {
			return;
		}
		var $embed_codes = $("#embed-codes");
		$.ajax({
				type: "POST",
				data: {
					action: "get-album-contents",
					albumid: APP.obj.resource.id
				},
				cache: false
			})
			.always(function (XHR) {
				GO.fn.loading.destroy($loading);
				if(XHR.status_code == 200) {
					APP.fn.fillEmbedCodes(XHR.contents, "#tab-codes");
					$embed_codes.removeClass("soft-hidden");
				}
			});
	});

	if ($("body").is("#upload")) {
		APP.fn.uploader.toggle({
			show: true
		});
	}

	$(document).on("keyup", function (e) {
		if ($(GO.obj.modal.selectors.root).exists() || !($(".viewer").exists() && e.which in APP.fn.listingViewer.keys)) {
			return;
		}
		var direct = [88, 37, 39]; // X <- ->
		var action = APP.fn.listingViewer.keys[e.which];
		if (direct.indexOf(e.which) == -1) {
			$("[data-action=" + action + "]", APP.fn.listingViewer.selectors.root).click();
		} else {
			if (action in APP.fn.listingViewer) {
				APP.fn.listingViewer[action]();
			}
		}
	});

	$(document).on("click", APP.fn.listingViewer.selectors.root + " [data-action^=viewer-]", function () {
		var action = $(this).data("action").substring("viewer-".length);
		if (action in APP.fn.listingViewer) {
			APP.fn.listingViewer[action]();
		}
	});

	$(document).on("click", "a[data-href]:not([rel=popup-link]):not(.popup-link)", function () {
		var data = $(this).attr("data-href");
		var href = $(this).attr("href");
		if (!data && !href) return;
		location.href = href ? href : data;
	});

	if (typeof APP.obj.config !== typeof undefined && APP.obj.config.listing.viewer) {
		$(document).on("click", GO.obj.listing.selectors.list_item + "[data-type=image] a.image-container", function (e) {
			e.preventDefault();
			e.stopPropagation();
			var $item = $(this).closest(GO.obj.listing.selectors.list_item);
			if (!$item.exists()) return;
			APP.fn.listingViewer.open($item);
		});
	}

	$(document).on("contextmenu", APP.fn.listingViewer.selectors.src, function (e) {
		e.preventDefault();
		return false;
	});

	var UrlParams = GO.fn.deparam(window.location.search);
	if (UrlParams && "viewer" in UrlParams) {
		var $parent = $(GO.obj.listing.selectors.content_listing_visible);
		console.log($parent)
		if ($parent.data("list") == "images") {
			var $item = $(GO.obj.listing.selectors.list_item, $parent)[UrlParams.viewer == "next" ? "first" : "last"]();
			APP.fn.listingViewer.open($item);
		}
	}

});

if (typeof APP == "undefined") {
	APP = {
		obj: {},
		fn: {},
		str: {}
	};
}

if (window.opener) {
	APP.obj.opener = {
		uploadPlugin: {}
	};
}

APP.fn.listingViewer = {
	selectors: {
		bodyShown: ".--viewer-shown",
		template: "#viewer-template",
		root: ".viewer",
		rootShow: ".viewer--show",
		rootHide: ".viewer--hide",
		rootZero: ".viewer--zero",
		rootNavPrev: ".viewer--nav-prev",
		rootNavNext: ".viewer--nav-next",
		src: ".viewer-src",
		tools: ".viewer-tools",
		loader: ".viewer-loader",
		owner: ".viewer-owner",
		ownerGuest: ".viewer-owner--guest",
		ownerUser: ".viewer-owner--user",
		inputMap: ".viewer-kb-input",
	},
	keys: {
		83: 'select',
		76: 'like',
		70: 'flag',
		69: 'edit',
		65: 'move',
		46: 'delete',
		88: 'close',
		37: 'prev',
		39: 'next',
	},
	keymap: {
		'select': ['S', GO.fn._s('Toggle select')],
		'like': ['L', GO.fn._s('Like')],
		'flag': ['F', GO.fn._s('Toggle flag')],
		'edit': ['E', GO.fn._s('Edit')],
		'move': ['A', GO.fn._s('Album')],
		'delete': ['Del', GO.fn._s('Delete')],
		'close': ['X', GO.fn._s('Close')],
		'prev': ['◀', GO.fn._s('Previous')],
		'next': ['▶', GO.fn._s('Next')],
	},
	loading: null,
	idleTimer: 0,
	$item: null,
	show: function () {
		this.getEl("root").removeClass(this.selectors.rootHide.substring(1)).addClass(this.selectors.rootShow.substring(1));
		$("body").addClass(this.selectors.bodyShown.substring(1));
		var hammertime = new Hammer($(APP.fn.listingViewer.selectors.root).get(0), {
			direction: Hammer.DIRECTION_VERTICAL
		});
		hammertime.on("swipeleft swiperight", function (e) {
			// left -> next, right -> prev
			var swipe = e.type.substring("swipe".length) == "left" ? "next" : "prev";
			APP.fn.listingViewer[swipe]();
		});
		if ($("html").hasClass("device-mobile")) {
			this.fullscreen();
		}
	},
	getItem: function () {
		return this.$item;
	},
	getEl: function (sel) {
		var context = sel.startsWith("template") || sel.startsWith("root") ? false : this.selectors.root;
		return context ? $(this.selectors[sel], context) : $(this.selectors[sel]);
	},
	getObject: function (fresh) {
		if (fresh || typeof this.object == typeof undefined) {
			var json = decodeURIComponent(this.getItem().attr("data-object"));
			this.object = JSON && JSON.parse(json) || $.parseJSON(json);
		}
		return this.object;
	},
	placeholderSizing: function () {
		if (!this.getEl('root').exists()) return;
		var vW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var vH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		var vR = vW / vH;
		var eSrc = this.getEl("src")[0];
		var eW = eSrc.getAttribute("width");
		var eH = eSrc.getAttribute("height");
		var eR = eW / eH;
		var c = vR < eR;
		eSrc.classList.remove("--width-auto", "--height-auto");
		eSrc.classList.add("--" + (c ? "height" : "width") + "-auto");
	},
	filler: function (isOpened) {
		var _this = this;
		var $viewer = this.getEl("root");
		if (isOpened) {
			var $parsed = $(this.getParsedTemplate());
			$viewer.html($parsed.html());
		}
		$viewer[(this.getItem().hasClass("selected") ? "add" : "remove") + "Class"]("selected");
		var navActions = ['prev', 'next'];
		$.each(navActions, function (i, v) {
			var navSelector = _this.selectors['rootNav' + (v.charAt(0).toUpperCase() + v.slice(1).toLowerCase())];
			var action = $(GO.obj.listing.selectors.content_listing_pagination + ":visible").length > 0 ? "add" : (_this.getItem()[v]().exists() ? "add" : "remove");
			$viewer[action + "Class"](navSelector.substring(1));
		});
		$.each(this.getItem().get(0).attributes, function (i, attr) {
			if (!attr.name.startsWith("data-")) return true;
			$viewer.attr(attr.name, attr.value);
		});
		var handle = typeof this.object.user == typeof undefined ? "user" : "guest";
		handle = "owner" + (handle.charAt(0).toUpperCase() + handle.slice(1).toLowerCase());
		this.getEl(handle).remove();
		if (typeof this.object.user !== typeof undefined) {
			$(this.object.user.avatar ? ".default-user-image" : "img.user-image", this.getEl("ownerUser")).remove();
		}
		var $tools = this.getItem().find(".list-item-image-tools");
		this.getEl("tools").append($tools.html());
		$.each($tools.find("[data-action]"), function (i, v) {
			var action = $(this).attr("data-action");
			var keymap = _this.keymap[action];
			$('<div class="viewer-kb-key"><kbd>' + keymap[0] + '</kbd><span>' + keymap[1] + '</span></div>').appendTo(_this.getEl('inputMap'));
		});
		this.placeholderSizing();
		this.trickyLoad();
	},
	toggleFullscreen: function (fs) {
		var viewer = fs ? this.getEl("root")[0] : document;
		var rFS = fs ? (viewer.requestFullscreen || viewer.mozRequestFullScreen || viewer.webkitRequestFullScreen || viewer.msRequestFullscreen) : (viewer.exitFullscreen || viewer.webkitExitFullscreen || viewer.mozCancelFullScreen || viewer.msExitFullscreen);
		rFS.call(viewer);

	},
	fullscreen: function () {
		this.toggleFullscreen(true);
	},
	normalscreen: function () {
		this.toggleFullscreen(false);
	},
	remove: function () {
		this.getEl('root').remove();
	},
	getParsedTemplate: function () {
		var object = this.getObject(true);
		var template = this.getEl("template").html();
		var matches = template.match(/%(\S+)%/g);
		if (matches) {
			$.each(matches, function (i, v) {
				var handle = v.slice(1, -1).split(".");
				var value;
				handle.map(function (k) {
					var aux = !value ? object : value;
					if (k in aux) {
						value = aux[k]
					}
				});
				var regex = new RegExp(v, "g");
				template = template.replace(regex, value);
			});
		}
		return template;
	},
	insertEl: function () {
		var html = this.getParsedTemplate();
		this.getEl("rootZero").remove();
		$(html).appendTo("body");
	},
	toggleIdle: function (idle, refresh) {
		var _this = this;
		var refresh = typeof refresh == typeof undefined ? true : refresh;
		$("html")[((idle ? "add" : "remove")) + "Class"]("--idle");
		if (!idle) {
			clearTimeout(_this.idleTimer);
			if (refresh) {
				_this.idleTimer = setTimeout(function () {
					var $fs = $(".fullscreen");
					var $el = _this.getEl("root");
					_this.toggleIdle($el.length > 0 && $fs.length == 0);
				}, 5000);
			}
		}
	},
	open: function ($item) {
		this.setItem($item);
		this.insertEl();
		this.filler();
		this.show();
		this.toggleIdle(false); // init idler
		var _this = this;
		this.getEl("root").on("mousemove mouseout", function () {
			_this.toggleIdle(false);
		});
	},
	setItem: function ($item) {
		this.$item = $item;
	},
	trickyLoad: function () {
		var $loader = this.getEl("loader");
		if (this.object.image.url == this.object.display_url) {
			$loader.remove();
			return;
		}
		var srcHtml = this.getEl('src').parent().html();
		var $src = $(srcHtml).attr("src", this.object.image.url);
		$src.insertBefore(this.getEl('src'));
		GO.fn.loading.inline($loader, {
			color: "white",
			size: "small",
			center: true,
			valign: true
		});
		$loader.hide().fadeIn("slow");
		$src.imagesLoaded(function () {
			$src.next().remove();
			GO.fn.loading.destroy($loader);
		});
	},
	close: function () {
		var _this = this;
		$(this.selectors.root).removeClass(this.selectors.rootShow.substring(1)).addClass(this.selectors.rootHide.substring(1));
		$("body").removeClass(this.selectors.bodyShown.substring(1));
		this.toggleIdle(false, false);
		setTimeout(function () {
			_this.remove();
		}, 200);
	},
	browse: function (direction) {
		var $item = this.getItem()[direction]();
		if (!$item.exists()) {
			var $pagination = $("[data-pagination=" + direction + "]", GO.obj.listing.selectors.content_listing_pagination + ":visible");
			var href = $pagination.attr("href");
			if (!href) return;
			var UrlParams = GO.fn.deparam(window.location.search);
			window.location.href = href + "&viewer=" + direction;
			return;
		}
		//var idle = $("html").hasClass("--idle");
		this.setItem($item);
		this.filler(true);
		//if(idle) {
		//$("html").addClass("--idle")
		//}
		var $loadMore = $(GO.obj.listing.selectors.content_listing_pagination, GO.obj.listing.selectors.content_listing_visible).find("[data-action=load-more]");
		var padding = $item[direction + "All"]().length;
		if ($loadMore.length > 0 && padding <= 5 && !GO.obj.listing.calling && direction == "next") {
			$("[data-action=load-more]").click();
		}
	},
	prev: function () {
		this.browse('prev');
	},
	next: function () {
		this.browse('next');
	}
};

APP.obj.image_viewer = {
	selector: "#image-viewer",
	container: "#image-viewer-container",
	navigation: ".image-viewer-navigation",
	loading: "#image-viewer-loading",
	loader: "#image-viewer-loader",
};
APP.obj.image_viewer.$container = $(APP.obj.image_viewer.container);
APP.obj.image_viewer.$navigation = $(APP.obj.image_viewer.navigation);
APP.obj.image_viewer.$loading = $(APP.obj.image_viewer.loading);

APP.fn.system = {
	checkUpdates: function (callback) {
		$.ajax({
				url: GOCORE.api.get.info + '/',
				data: null,
				cache: false
			})
			.always(function (data, status, XHR) {
				if (typeof callback == "function") {
					callback(XHR);
				}
			});
	}
};

APP.fn.bindSelectableItems = function () {
	var el = 'content-listing-wrapper';
	var sel = "#" + el;
	if (!$(sel).exists()) {
		$("[data-content=list-selection]").closest(".content-width").wrap("<div id='" + el + "' />");
	} else if ($(sel).hasClass("ui-selectable")) {
		$(sel).selectable("destroy");
	}

	if (!$("[data-content=list-selection]").exists()) {
		return;
	}

	$("html.device-nonmobile " + sel).selectable({
		delay: 150,
		filter: GO.obj.listing.selectors.list_item,
		cancel: ".content-empty, .header, #tab-share, #tab-full-info, .viewer-title, .header-link, .top-bar, .content-listing-pagination *, #fullscreen-modal, #top-user, #background-cover, .list-item-desc, .list-item-image-tools, [data-action=load-image], #tab-codes",
		selecting: function (event, ui) {
			var $this = $(ui.selecting);
			var unselect = $this.hasClass("selected");
			APP.fn.list_editor[(unselect ? "unselect" : "select") + "Item"]($this);
		},
		unselecting: function (event, ui) {
			APP.fn.list_editor.unselectItem($(ui.unselecting));
		}
	});

};

APP.fn.isCachedImage = function (src) {
	var image = new Image();
	image.src = src;
	return image.complete || image.width + image.height > 0;
};

APP.fn.viewerImageZoomClass = function () {
	if (APP.obj.image_viewer.$container.hasClass("jscursor-zoom-in")) {
		APP.obj.image_viewer.$container.addClass("cursor-zoom-in").removeClass("jscursor-zoom-in");
	}
};

APP.fn.viewerLoadImage = function () {
	if (APP.obj.image_viewer.$loading.exists()) {
		APP.obj.image_viewer.$loading.removeClass("soft-hidden").css({
			zIndex: 2
		});
		GO.fn.loading.inline(APP.obj.image_viewer.$loading, {
			color: "white",
			size: "small",
			center: true,
			valign: true
		});
		APP.obj.image_viewer.$loading.hide().fadeIn("slow");
	}
	$(APP.obj.image_viewer.loader).remove();
	APP.obj.image_viewer.image.html = APP.obj.image_viewer.$container.html();
	APP.obj.image_viewer.$container.prepend($(APP.obj.image_viewer.image.html).css({
		top: 0,
		zIndex: 0
	}));
	APP.obj.image_viewer.$container.find("img").eq(0).css("zIndex", 1);
	APP.obj.image_viewer.$container.find("img").eq(1).attr("src", APP.obj.image_viewer.image.url).css({
		width: "100%",
		height: "auto"
	});
	APP.obj.image_viewer.$container.find("img").eq(1).imagesLoaded(function () {
		APP.obj.image_viewer.$container.find("img").eq(1).css({
			width: "",
			height: ""
		});
		APP.obj.image_viewer.$container.find("img").eq(0).remove();
		GO.fn.loading.destroy(APP.obj.image_viewer.$loading);
	});
};

APP.obj.embed_tpl = {};

APP.obj.topBar = {
	transparencyScrollToggle: function () {
		var Y = $(window).scrollTop();
		$("#top-bar")[(Y > 0 ? "remove" : "add") + "Class"]("transparent");
	}
};

APP.obj.uploaderReset = {
	isUploading: false,
	canAdd: true,
	queueStatus: "ready",
	uploadThreads: 0,
	uploadParsedIds: [],
	uploadProcessedIds: [],
	files: {},
	results: {
		success: {},
		error: {}
	},
	toggleWorking: 0,
	filesAddId: 0,
	clipboardImages: [],
};

APP.fn.uploader = {

	selectors: {
		root: "#anywhere-upload",
		show: ".upload-box--show",
		queue: "#anywhere-upload-queue",
		queue_complete: ".queue-complete",
		queue_item: ".queue-item",
		close_cancel: "[data-button=close-cancel]",
		file: "#anywhere-upload-input",
		camera: "#anywhere-upload-input-camera",
		upload_item_template: "#anywhere-upload-item-template",
		item_progress_bar: "[data-content=progress-bar]",
		item_progress_percent: "[data-text=progress-percent]",
		failed_result: "[data-content=failed-upload-result]",
		fullscreen_mask: "#fullscreen-uploader-mask",
		dropzone: "#uploader-dropzone",
		paste: "#anywhere-upload-paste",
		input: "[data-action=anywhere-upload-input]",
	},

	toggle: function (options, args) {

		this.queueSize();

		var $switch = $("[data-action=top-bar-upload]", ".top-bar");
		var show = !$(APP.fn.uploader.selectors.root).data("shown");
		var options = $.extend({
			callback: null,
			reset: true
		}, options);

		if (typeof options.show !== typeof undefined && options.show) {
			show = true;
		}

		GO.fn.growl.close(true);
		GO.fn.close_pops();

		if (this.toggleWorking == 1 || $(APP.fn.uploader.selectors.root).is(":animated") || APP.fn.uploader.isUploading || ($switch.data('login-needed') && !GO.fn.is_user_logged())) return;

		this.toggleWorking = 1;

		var animation = {
			time: 500,
			easing: null,
		};
		var callbacks = function () {
			if (!show && options.reset) {
				APP.fn.uploader.reset();
			}
			if (GO.obj.follow_scroll.$node.exists()) {
				GO.obj.follow_scroll.$node.removeClass("fixed");
				GO.obj.follow_scroll.set();
			}
			GO.fn.topMenu.hide();
			if (typeof options.callback == "function") {
				options.callback(args);
			}
			APP.fn.uploader.boxSizer();
			APP.fn.uploader.toggleWorking = 0;
		};

		$(APP.fn.uploader.selectors.root)[(show ? "add" : "remove") + "Class"](this.selectors.show.substring(1));

		if (show) {

			if (!$("body").is("#upload") && GO.fn.isDevice(["phone", "phablet"])) {
				$("html").addClass("overflow-hidden");
			}

			$("html").data({
				"followed-scroll": $("html").hasClass("followed-scroll"),
				"top-bar-box-shadow-prevent": true
			}).removeClass("followed-scroll").addClass("top-bar-box-shadow-none");

			$("#top-bar").data({
				"stock_classes": $("#top-bar").attr("class")
			});

			$(".current[data-nav]", ".top-bar").each(function () {
				if ($(this).is("[data-action=top-bar-menu-full]")) return;
				$(this).removeClass("current").attr("data-current", 1);
			});

			if (GO.fn.isDevice("mobile")) {
				var $upload_heading = $(".upload-box-heading", $(APP.fn.uploader.selectors.root));
				$upload_heading.css({
					position: "relative",
					top: 0.5 * ($(window).height() - $upload_heading.height()) + "px"
				});
			}
			APP.fn.uploader.focus(function () {
				setTimeout(function () {
					callbacks();
				}, animation.time);
			});
		} else { // hide
			$("[data-nav][data-current=1]", ".top-bar").each(function () {
				$(this).addClass("current");
			});

			$(APP.fn.uploader.selectors.fullscreen_mask).css({
				opacity: 0
			});
			setTimeout(function () {
				$(APP.fn.uploader.selectors.fullscreen_mask).remove();
				if ($("html").data("followed-scroll")) {
					$("html").addClass("followed-scroll");
				}
			}, 250);

			var _uploadBoxHeight = $(APP.fn.uploader.selectors.root).outerHeight();
			var _uploadBoxPush = (_uploadBoxHeight - parseInt($(APP.fn.uploader.selectors.root).data("initial-height"))) + "px";
			$(APP.fn.uploader.selectors.root).css({
				transform: "translate(0,-" + _uploadBoxPush + ")"
			});

			setTimeout(function () {
				$("#top-bar").attr("class", $("#top-bar").data("stock_classes"));
				$("html").removeClass(($(".follow-scroll-wrapper.position-fixed").exists() ? "" : "top-bar-box-shadow-none"));
			}, animation.time * 1 / 3);

			setTimeout(function () {
					$(APP.fn.uploader.selectors.root).css({
						top: ""
					});
					if ($("body#image").exists()) {
						APP.obj.topBar.transparencyScrollToggle();
					}
					callbacks();
					$("html,body")
						.removeClass("overflow-hidden")
						.data({
							"top-bar-box-shadow-prevent": false
						});
				},
				animation.time);
		}

		$(APP.fn.uploader.selectors.root).data("shown", show);

		$switch.toggleClass("current").removeClass("opened");
	},

	reset: function () {

		$.extend(this, $.extend(true, {}, APP.obj.uploaderReset));

		$("li", this.selectors.queue).remove();
		$(this.selectors.root).height("").css({
			"overflow-y": "",
			"overflow-x": ""
		});

		$(this.selectors.queue)
			.addClass('queueEmpty')
			.removeClass(this.selectors.queue_complete.substring(1));

		$(this.selectors.input, this.selectors.root).each(function () {
			$(this).prop("value", null);
		});
		$("[data-group=upload-result] textarea", this.selectors.root).prop("value", "");
		$.each(['upload-queue-ready', 'uploading', 'upload-result', 'upload-queue-ready', 'upload-queue'], function (i, v) {
			$("[data-group=" + v + "]").hide();
		});
		$("[data-group=upload]", this.selectors.root).show();
		// Force HTML album selection (used for upload to current album)
		$("[name=upload-album-id]", this.selectors.root).prop("value", function () {
			var $selected = $("option[selected]", this);
			if ($selected.exists()) {
				return $selected.attr("value");
			}
		});

		$(this.selectors.root)
			.removeClass('queueCompleted queueReady queueHasResults')
			.addClass('queueEmpty')
			.attr("data-queue-size", 0);

		// Always ask for category
		$("[name=upload-category-id]", this.selectors.root).prop("value", "");
		$("[name=upload-nsfw]", this.selectors.root).prop("checked", this.defaultChecked);
		$("[name=upload-object-id]", this.selectors.root).prop("value", "");
		
		this.boxSizer(true);
	},

	focus: function (callback) {
		if ($(this.selectors.fullscreen_mask).exists()) return;
		if (!$("body").is("#upload")) {
			$("body").append($("<div/>", {
				id: (this.selectors.fullscreen_mask.replace("#", "")),
				class: "fullscreen soft-black",
			}).css({
				top: GO.fn.isDevice("phone") ? 0 : $(APP.fn.uploader.selectors.root).data("top")
			}));
		}
		setTimeout(function () {
			if (!$("body").is("#upload")) {
				$(APP.fn.uploader.selectors.fullscreen_mask).css({
					opacity: 1
				});
			}
			setTimeout(function () {
				if (typeof callback == "function") {
					callback();
				}
			}, GO.fn.isDevice(["phone", "phablet"]) ? 0 : 250);
		}, 1);
	},

	boxSizer: function (forced) {

		var shown = $(this.selectors.root).is(this.selectors.show);
		var doit = shown || forced;

		if (shown && !$("body").is("#upload")) {
			$("html")[(GO.fn.isDevice(["phone", "phablet"]) ? "add" : "remove") + "Class"]("overflow-hidden");
		}

		if (!doit) return;

		$(this.selectors.root).height("");

		if (!$("body").is("#upload") && $(this.selectors.root).height() > $(window).height()) {
			$(this.selectors.root).height($(window).height()).css({
				"overflow-y": "scroll",
				"overflow-x": "auto"
			});
			$("body").addClass("overflow-hidden");
		} else {
			$(this.selectors.root).css("overflow-y", "");
			$("body").removeClass("overflow-hidden");
		}
	},

	pasteURL: function () {
		var urlvalues = $("[name=urls]", "#fullscreen-modal").val();
		if (urlvalues) {
			APP.fn.uploader.add({}, urlvalues);
		}
	},

	pasteImageHandler: function (e) {
		// Leave the inputs alone
		if ($(e.target).is(":input")) {
			return;
		}
		// Get the items from the clipboard
		if (typeof e.clipboardData !== typeof undefined && e.clipboardData.items) {
			var items = e.clipboardData.items;
		} else { // Get the items from the contenteditable catcher
			setTimeout(function () { // Hack to get the items after paste
				e.clipboardData = {};
				e.clipboardData.items = [];
				$.each($("img", APP.fn.uploader.$pasteCatcher), function (i, v) {
					e.clipboardData.items.push(GO.fn.dataURItoBlob($(this).attr("src")));
				});
				$(APP.fn.uploader.selectors.paste).html("");
				return APP.fn.uploader.pasteImageHandler(e);
			}, 1);
		}
		if (items) {
			// Loop through all items, looking for any kind of image
			for (var i = 0; i < items.length; i++) {
				if (items[i].type.indexOf("image") !== -1) {
					var file = items[i] instanceof Blob ? items[i] : items[i].getAsFile();
					var reader = new FileReader();
					reader.onload = function (evt) {
						var uploaderIsVisible = $(APP.fn.uploader.selectors.root).data("shown");
						// Give a name to this clipboard image
						file.name = GO.fn._s('Clipboard image') + ' ' + GO.fn.getDateTime();
						// Mimic file select event
						var file_evt = {
							originalEvent: {
								dataTransfer: {
									files: [file]
								},
								preventDefault: function () {},
								stopPropagation: function () {},
								clipboard: true,
								dataURL: evt.target.result,
								name: file.name
							}
						};
						if (!uploaderIsVisible) {
							APP.fn.uploader.toggle({
								callback: function () {
									APP.fn.uploader.add(file_evt);
								}
							});
						} else {
							APP.fn.uploader.add(file_evt);
						}
					};
					reader.readAsDataURL(file);
				}
			}
		}
	},

	add: function (e, urls) {

		var md5;

		// Prevent add items ?
		if (!this.canAdd) {
			var e = e.originalEvent;
			e.preventDefault();
			e.stopPropagation();
			return false;
		}

		$fileinput = $(this.selectors.file);
		$fileinput.replaceWith($fileinput = $fileinput.clone(true));

		var item_queue_template = $(this.selectors.upload_item_template).html();
		var files = [];

		if (typeof urls == typeof undefined) { // Local files
			var e = e.originalEvent;
			e.preventDefault();
			e.stopPropagation();
			files = e.dataTransfer || e.target;
			files = $.makeArray(files.files);

			// Keep a map for the clipboard images
			if (e.clipboard) {
				md5 = GO.fn.md5(e.dataURL);
				if ($.inArray(md5, this.clipboardImages) != -1) {
					return null;
				}
				this.clipboardImages.push(md5);
			}

			// Filter non-images
			var failed_files = [];
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				var image_type_str;
				if (typeof file.type == "undefined" || file.type == "") { // Some browsers (Android) don't set the correct file.type
					image_type_str = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
				} else {
					image_type_str = file.type.replace("image/", "");
				}
				// Size filter
				if (file.size > APP.obj.config.image.max_filesize.getBytes()) {
					failed_files.push({
						uid: i,
						name: file.name.truncate_middle() + " - " + GO.fn._s("File too big.")
					});
					continue;
				}
				// Android can output something like image:10 as the full file name so ignore this filter
				if (APP.obj.config.upload.image_types.indexOf(image_type_str) == -1 && /android/i.test(navigator.userAgent) == false) {
					failed_files.push({
						uid: i,
						name: file.name.truncate_middle() + " - " + GO.fn._s("Invalid or unsupported file format.")
					});
					continue;
				}
				if (md5) {
					file.md5 = md5;
				}
				file.fromClipboard = e.clipboard == true;
				file.uid = i;
			}

			for (var i = 0; i < failed_files.length; i++) {
				var failed_file = failed_files[i];
				files.splice(failed_file.id, 1);
			}

			if (failed_files.length > 0 && files.length == 0) {
				var failed_message = '';
				for (var i = 0; i < failed_files.length; i++) {
					failed_message += "<li>" + failed_files[i].name + "</li>";
				}
				GO.fn.modal.simple({
					title: GO.fn._s("Some files couldn't be added"),
					message: "<ul>" + "<li>" + failed_message + "</ul>"
				});
				return;
			}

			if (files.length == 0) {

				return;
			}
		} else { // Remote files
			// Strip HTML + BBCode
			urls = urls.replace(/(<([^>]+)>)/g, '').replace(/(\[([^\]]+)\])/g, '');
			files = urls.match_urls();
			if (!files) return;
			files = files.array_unique();
			files = $.map(files, function (file, i) {
				return {
					uid: i,
					name: file,
					url: file
				};
			});
		}

		// Empty current files object?
		if ($.isEmptyObject(this.files)) {
			for (var i = 0; i < files.length; i++) {
				this.files[files[i].uid] = files[i];
				this.filesAddId++;
			}
		} else {
			/**
			 * Check duplicates by file name (local and remote)
			 * This is basic but is the quickest way to do it
			 * Note: it doesn't work on iOS for local files http://stackoverflow.com/questions/18412774/get-real-file-name-in-ios-6-x-filereader
			 */
			var currentfiles = [];
			for (var key in this.files) {
				if (typeof this.files[key] == "undefined" || typeof this.files[key] == "function") continue;
				currentfiles.push(encodeURI(this.files[key].name));
			}
			files = $.map(files, function (file, i) {
				if ($.inArray(encodeURI(file.name), currentfiles) != -1) {
					return null;
				}
				file.uid = APP.fn.uploader.filesAddId + i;
				APP.fn.uploader.filesAddId++;
				return file;
			});
			for (var i = 0; i < files.length; i++) {
				this.files[files[i].uid] = files[i];
			}

		}

		$(this.selectors.queue, this.selectors.root).append(item_queue_template.repeat(files.length));

		$(this.selectors.queue + " " + this.selectors.queue_item + ":not([data-id])", this.selectors.root).hide(); // hide the stock items

		var failed_before = failed_files,
			failed_files = [],
			j = 0,
			default_options = {
				canvas: true,
				maxWidth: 590
			};

		function CHVLoadImage(i) {

			if (typeof i == typeof undefined) {
				var i = 0;
			}

			if (!(i in files)) {
				GO.fn.loading.destroy("fullscreen");
				return;
			}

			var file = files[i];

			$(APP.fn.uploader.selectors.queue_item + ":not([data-id]) .load-url", APP.fn.uploader.selectors.queue)[typeof file.url !== "undefined" ? "show" : "remove"]();

			loadImage.parseMetaData(file.url ? file.url : file, function (data) {

				// Set the queue item placeholder ids
				$(APP.fn.uploader.selectors.queue_item + ":not([data-id]) .preview:empty", APP.fn.uploader.selectors.queue).first().closest("li").attr("data-id", file.uid);

				// Load the image (async)
				loadImage(file.url ? file.url : file, function (img) {

					++j;

					var $queue_item = $(APP.fn.uploader.selectors.queue_item + "[data-id=" + (file.uid) + "]", APP.fn.uploader.selectors.queue);

					if (img.type === "error" /* || typeof data.imageHead == typeof undefined*/ ) { // image parse error (png always return undefined data)
						failed_files.push({
							uid: file.uid,
							name: file.name.truncate_middle()
						});
					} else {
						if (!$("[data-group=upload-queue]", APP.fn.uploader.selectors.root).is(":visible")) {
							$("[data-group=upload-queue]", APP.fn.uploader.selectors.root).css("display", "block");
						}

						// Detect true mimetype
						var mimetype = "image/jpeg"; // Default unknown mimetype

						if (typeof data.buffer !== typeof undefined) {
							var buffer = (new Uint8Array(data.buffer)).subarray(0, 4);
							var header = "";
							for (var i = 0; i < buffer.length; i++) {
								header += buffer[i].toString(16);
							}
							var header_to_mime = {
								'89504e47': 'image/png',
								'47494638': 'image/gif',
								'ffd8ffe0': 'image/jpeg',
							};
							$.each(['ffd8ffe1', 'ffd8ffe2'], function (i, v) {
								header_to_mime[v] = header_to_mime['ffd8ffe0'];
							});
							if (typeof header_to_mime[header] !== typeof undefined) {
								mimetype = header_to_mime[header];
							}
						}

						var title = null;
						if (typeof file.name !== typeof undefined) {
							var basename = GO.fn.baseName(file.name);
							title = $.trim(basename.substring(0, 100).capitalizeFirstLetter() /*.replace(/\.[^/.]+$/g, "").replace(/[\W_]+/g, " ")*/ );
						}

						// Set source image data
						APP.fn.uploader.files[file.uid].parsedMeta = {
							title: title,
							width: img.originalWidth,
							height: img.originalHeight,
							mimetype: mimetype,
						};

						$queue_item.show();

						$(APP.fn.uploader.selectors.root)
							.addClass('queueReady')
							.removeClass('queueEmpty');

						$("[data-group=upload-queue-ready]", APP.fn.uploader.selectors.root).show();
						$("[data-group=upload]", APP.fn.uploader.selectors.root).hide();

						$queue_item.find(".load-url").remove();
						$queue_item.find(".preview").removeClass("soft-hidden").show().append(img);

						$img = $queue_item.find(".preview").find("img,canvas");
						$img.attr("class", "canvas");

						queue_item_h = $queue_item.height();
						queue_item_w = $queue_item.width();

						var img_w = parseInt($img.attr("width")) || $img.width();
						var img_h = parseInt($img.attr("height")) || $img.height();
						var img_r = img_w / img_h;

						$img.hide();

						if (img_w > img_h || img_w == img_h) { // Landscape
							var queue_img_h = img_h < queue_item_h ? img_h : queue_item_h;
							if (img_w > img_h) {
								$img.height(queue_img_h).width(queue_img_h * img_r);
							}
						}
						if (img_w < img_h || img_w == img_h) { // Portrait
							var queue_img_w = img_w < queue_item_w ? img_w : queue_item_w;
							if (img_w < img_h) {
								$img.width(queue_img_w).height(queue_img_w / img_r);
							}
						}
						if (img_w == img_h) {
							$img.height(queue_img_h).width(queue_img_w);
						}

						$img.css({
							marginTop: -$img.height() / 2,
							marginLeft: -$img.width() / 2
						}).show();

						APP.fn.uploader.boxSizer();

					}

					// Last one
					if (j == files.length) {

						if (typeof failed_before !== "undefined") {
							failed_files = failed_files.concat(failed_before);
						}

						GO.fn.loading.destroy("fullscreen");

						if (failed_files.length > 0) {
							var failed_message = "";
							for (var i = 0; i < failed_files.length; i++) {
								failed_message += "<li>" + failed_files[i].name + "</li>";
								delete APP.fn.uploader.files[failed_files[i].uid];
								$("li[data-id=" + failed_files[i].uid + "]", APP.fn.uploader.selectors.queue).find("[data-action=cancel]").click();
							}
							GO.fn.modal.simple({
								title: GO.fn._s("Some files couldn't be added"),
								message: '<ul>' + failed_message + '</ul>'
							});
						} else {
							APP.fn.uploader.focus();
						}

						APP.fn.uploader.boxSizer();
					}

				}, $.extend({}, default_options, {
					orientation: data.exif ? data.exif.get("Orientation") : 1
				}));

				// Next one
				setTimeout(function () {
					CHVLoadImage(i + 1);
				}, 25); // Spare some time...

			});
		}

		GO.fn.loading.fullscreen();

		// Load all the target images starting from zero (null in this case, yeah I like to fuck around just because reasons)
		CHVLoadImage();

		this.queueSize();
	},

	queueSize: function () {
		$(this.selectors.root).attr("data-queue-size", Object.size(this.files));
		$("[data-text=queue-objects]", this.selectors.root).text(GO.fn._n("image", "images", Object.size(this.files)));
		$("[data-text=queue-size]", this.selectors.root).text(Object.size(this.files));
	},

	queueProgress: function (e, id) {
		var queue_size = Object.size(this.files);
		this.files[id].progress = e.loaded / e.total;
		var progress = 0;
		for (var i = 0; i < queue_size; i++) {
			if (typeof this.files[i] == typeof undefined || !('progress' in this.files[i])) continue;
			progress += this.files[i].progress;
		}
		$("[data-text=queue-progress]", this.selectors.root).text(parseInt(100 * progress / queue_size));
	},

	upload: function ($queue_item) {

		var id = $queue_item.data("id");
		var nextId = $queue_item.next().exists() ? $queue_item.next().data("id") : false;

		// Already working on this?
		if ($.inArray(id, this.uploadParsedIds) !== -1) {
			if ($queue_item.next().exists()) {
				this.upload($queue_item.next());
			}
			return;
		}

		var self = this;

		this.uploadParsedIds.push(id);

		var f = this.files[id];
		if (typeof f == typeof undefined) {
			return;
		}
		var queue_is_url = typeof f.url !== typeof undefined;
		var source = queue_is_url ? f.url : f;
		var hasForm = typeof f.formValues !== typeof undefined;

		if (typeof f == typeof undefined) {
			if ($queue_item.next().exists()) {
				this.upload($queue_item.next());
			}
			return;
		}

		this.uploadThreads += 1;

		if (this.uploadThreads < APP.obj.config.upload.threads && nextId) {
			this.upload($queue_item.next());
		}

		this.isUploading = true;

		// HTML5 form
		var form = new FormData();
		var formData = {
			source: null,
			type: queue_is_url ? "url" : "file",
			action: "upload",
			privacy: $("[data-privacy]", this.selectors.root).first().data("privacy"),
			timestamp: this.timestamp,
			auth_token: GO.obj.config.auth_token,
			category_id: $("[name=upload-category-id]", this.selectors.root).val() || null,
			nsfw: $("[name=upload-nsfw]", this.selectors.root).prop("checked") ? 1 : 0,
			album_id: $("[name=upload-album-id]", this.selectors.root).val() || null,
			object_id: $("[name=upload-object-id]", this.selectors.root).val() || null
		};

		// Append URL BLOB source
		if (queue_is_url) {
			formData.source = source;
		} else {
			form.append("source", source, f.name); // Stupid 3rd argument for file
		}
		if (hasForm) { // Merge with each queue item form data
			$.each(f.formValues, function (i, v) {
				formData[i.replace(/image_/g, "")] = v;
			});
		}

		$.each(formData, function (i, v) {
			if (v === null) return true;
			form.append(i, v);
		});

		this.files[id].xhr = new XMLHttpRequest();

		$queue_item.removeClass("waiting");
		$(".block.edit, .queue-item-button.edit", $queue_item).remove();

		if (!queue_is_url) {
			this.files[id].xhr.upload.onprogress = function (e) {

				if (e.lengthComputable) {

					APP.fn.uploader.queueProgress(e, id);

					percentComplete = parseInt((e.loaded / e.total) * 100);

					$(APP.fn.uploader.selectors.item_progress_percent, $queue_item).text(percentComplete);
					$(APP.fn.uploader.selectors.item_progress_bar, $queue_item).width(100 - percentComplete + "%");

					if (percentComplete == 100) {
						$(APP.fn.uploader.selectors.item_progress_percent, $queue_item).text("");
						APP.fn.uploader.itemLoading($queue_item);
					}
				}

			};
		} else {
			this.queueSize();
			this.queueProgress({
				loaded: 1,
				total: 1
			}, id);
			this.itemLoading($queue_item);
		}

		this.files[id].xhr.onreadystatechange = function () {

			var is_error = false;

			if (this.readyState == 4 && typeof APP.fn.uploader.files[id].xhr !== "undefined" && APP.fn.uploader.files[id].xhr.status !== 0) {

				self.uploadProcessedIds.push(id);
				self.uploadThreads -= 1;

				$(".loading-indicator", $queue_item).remove();
				$queue_item.removeClass("waiting uploading");

				try {
					// Parse the json response
					var JSONresponse = this.responseType !== "json" ? JSON.parse(this.response) : this.response;

					if (typeof JSONresponse !== "undefined" && this.status == 200) {
						$("[data-group=image-link]", $queue_item).attr("href", JSONresponse.image.url_viewer);
					} else {
						if (JSONresponse.error.context == "PDOException") {
							JSONresponse.error.message = "Database error";
						}
						JSONresponse.error.message = APP.fn.uploader.files[id].name.truncate_middle() + " - " + JSONresponse.error.message;
					}

					// Save the server response (keeping indexing for results)
					APP.fn.uploader.results[this.status == 200 ? "success" : "error"][id] = JSONresponse;

					if (this.status !== 200) is_error = true;

				} catch (err) {

					is_error = true;

					var err_handle;

					if (typeof JSONresponse == typeof undefined) {
						// Server epic error
						err_handle = {
							status: 500,
							statusText: "Internal server error"
						};
					} else {
						err_handle = {
							status: 400,
							statusText: JSONresponse.error.message
						};
					}

					JSONresponse = {
						status_code: err_handle.status,
						error: {
							message: APP.fn.uploader.files[id].name.truncate_middle() + " - Server error (" + err_handle.statusText + ")",
							code: err_handle.status,
							context: "XMLHttpRequest"
						},
						status_txt: err_handle.statusText
					};

					var error_key = Object.size(APP.fn.uploader.results.error) + 1;

					APP.fn.uploader.results.error[error_key] = JSONresponse;
				}

				$queue_item.addClass(!is_error ? "completed" : "failed");

				if (typeof JSONresponse.error !== "undefined" && typeof JSONresponse.error.message !== "undefined") {
					$queue_item.attr("rel", "tooltip").data("tiptip", "top").attr("title", JSONresponse.error.message);
					GO.fn.bindtipTip($queue_item);
				}

				if (self.uploadThreads < APP.obj.config.upload.threads && nextId) {
					APP.fn.uploader.upload($queue_item.next());
					$(APP.fn.uploader.selectors.root).addClass('queueHasResults');
				}

				if (self.uploadProcessedIds.length == Object.size(self.files)) {
					APP.fn.uploader.displayResults();
				}

				$(".done", $queue_item).fadeOut();
			}

		};

		this.files[id].xhr.open("POST", GO.obj.config.json_api, true);
		this.files[id].xhr.setRequestHeader("Accept", "application/json");
		this.files[id].xhr.send(form);
	},

	itemLoading: function ($queue_item) {
		GO.fn.loading.inline($(".progress", $queue_item), {
			color: "#FFF",
			size: "normal",
			center: true,
			position: "absolute",
			shadow: true
		});
		$("[data-action=cancel], [data-action=edit]", $queue_item).hide();
	},

	displayResults: function () {

		APP.fn.uploader.isUploading = false;

		var group_result = "[data-group=upload-result][data-result=%RESULT%]",
			result_types = ["error", "mixed", "success"],
			results = {};

		for (var i = 0; i < result_types.length; i++) {
			results[result_types[i]] = group_result.replace("%RESULT%", result_types[i]);
		}

		if (Object.size(this.results.error) > 0) {
			var error_files = [];
			for (var i in this.results.error) {
				if (typeof this.results.error[i] !== "object") continue;
				console.log(this.results.error[i])
				error_files[i] = this.results.error[i].error.message;
			}
			if (error_files.length > 0) {
				$(this.selectors.failed_result).html("<li>" + error_files.join("</li><li>") + "</li>");
			}
		} else {
			$(results.error, this.selectors.root).hide();
		}

		if (!window.opener && APP.obj.config.upload.redirect_single_upload && Object.size(this.results.success) == 1 && Object.size(this.results.error) == 0) {
			window.location.href = this.results.success[0].image.url_viewer;
			return false;
		}

		$("[data-text=queue-progress]", this.selectors.root).text(100);
		$("[data-group=uploading]", this.selectors.root).hide();

		$(this.selectors.root)
			.removeClass('queueUploading queueHasResults')
			.addClass('queueCompleted');

		$(this.selectors.queue).addClass(this.selectors.queue_complete.substring(1));

		// Append the embed codes
		if (Object.size(this.results.success) > 0 && $("[data-group=upload-result] textarea", this.selectors.root).exists()) {
			APP.fn.fillEmbedCodes(this.results.success, APP.fn.uploader.selectors.root, "val");
		}

		if (Object.size(this.results.success) > 0 && Object.size(this.results.error) > 0) {
			$(results.mixed + ", " + results.success, this.selectors.root).show();
		} else if (Object.size(this.results.success) > 0) {
			$(results.success, this.selectors.root).show();
		} else if (Object.size(this.results.error) > 0) {
			$(results.error, this.selectors.root).show();
		}

		if ($(results.success, this.selectors.root).is(":visible")) {
			$(results.success, this.selectors.root).find("[data-group^=user], [data-group=guest]").hide();
			$(results.success, this.selectors.root).find("[data-group=" + (GO.fn.is_user_logged() ? "user" : "guest") + "]").show();
			var firstKey = Object.keys(this.results.success)[0];
			if (typeof this.results.success[firstKey].image.album !== "undefined") {
				var albums = [];
				for (var key in this.results.success) {
					var image = this.results.success[key].image;
					if (image.album && !!image.album.id_encoded && albums.indexOf(image.album.id_encoded) == -1) {
						albums.push(image.album.id_encoded);
					}
				}
				var targetAlbum = {
					link: null,
					text: null
				};

				if (albums.length <= 1) {
					targetAlbum.link = this.results.success[firstKey].image.album.url;
					targetAlbum.text = this.results.success[firstKey].image.album.name;
				} else {
					targetAlbum.link = this.results.success[firstKey].image.user.url_albums;
					targetAlbum.text = GO.fn._s("%s's Albums", this.results.success[firstKey].image.user.name_short_html);
				}

				$("[data-text=upload-target]", this.selectors.root).text(targetAlbum.text);
				$("[data-link=upload-target]", this.selectors.root).attr("href", targetAlbum.link);

				if (GO.fn.is_user_logged()) {
					var show_user_stuff = albums.length > 0 ? "album" : "stream";
					$("[data-group=user-" + show_user_stuff + "]", this.selectors.root).show();
				}
			}
		}

		this.boxSizer();
		this.queueStatus = "done";

		// Detect plugin stuff
		if (window.opener && typeof APP.obj.opener.uploadPlugin[window.name] !== typeof undefined) {
			$('[data-action="copy"]', this.selectors.root).remove();
			if (APP.obj.opener.uploadPlugin[window.name].hasOwnProperty('autoInsert') && APP.obj.opener.uploadPlugin[window.name].autoInsert) {
				var $target = $(':input[name="' + APP.obj.opener.uploadPlugin[window.name].autoInsert + '"]', APP.fn.uploader.selectors.root);
				var value = $target.val();
				if (value) {
					window.opener.postMessage({
						id: window.name,
						message: value
					}, "*");
					window.close();
					return;
				}
			}
		} else {
			$('[data-action="openerPostMessage"]', this.selectors.root).remove();
		}

	}

};

$.extend(APP.fn.uploader, $.extend(true, {}, APP.obj.uploaderReset));

APP.fn.fillEmbedCodes = function (elements, parent, fn) {

	if (typeof fn == "undefined") {
		fn = "val";
	}

	$.each(elements, function (key, value) {

		if (typeof value == typeof undefined) return;

		var image = ("id_encoded" in value) ? value : value.image;

		if (!image.medium) { // Medium doesn't exists
			image.medium = {};
			var imageProp = ["filename", "name", "width", "height", "extension", "size", "size_formatted", "url"];
			for (var i = 0; i < imageProp.length; i++) {
				image.medium[imageProp[i]] = image[imageProp[i]];
			}
		}

		var flatten_image = Object.flatten(image);

		$.each(APP.obj.embed_tpl, function (key, value) {
			$.each(value.options, function (k, v) {

				var embed = v,
					$embed = $("textarea[name=" + k + "]", parent),
					template = embed.template;

				for (var i in flatten_image) {
					if (!flatten_image.hasOwnProperty(i)) {
						continue;
					}

					template = template.replace(new RegExp("%" + i.toUpperCase() + "%", "g"), flatten_image[i]);
				}

				$embed[fn]($embed.val() + template + ($embed.data("size") == "thumb" ? " " : "\n"));

			});

		});

	});

	// Remove any extra \n
	$.each(APP.obj.embed_tpl, function (key, value) {
		$.each(value.options, function (k, v) {
			var $embed = $("textarea[name=" + k + "]", parent);
			$embed[fn]($.trim($embed.val()));
		});
	});

};

APP.fn.resource_privacy_toggle = function (privacy) {
	if (!privacy) privacy = "public";
	$("[data-content=privacy-private]").hide();
	if (privacy !== "public") {
		$("[data-content=privacy-private]").show();
	}
};

// Album stuff
APP.fn.submit_create_album = function () {
	var $modal = $(GO.obj.modal.selectors.root);
	if ($("[name=form-album-name]", $modal).val() == "") {
		GO.fn.growl.call(GO.fn._s("You must enter the album name."));
		$("[name=form-album-name]", $modal).highlight();
		return false;
	}
	GO.obj.modal.form_data = {
		action: "create-album",
		type: "album",
		album: {
			name: $("[name=form-album-name]", $modal).val(),
			description: $("[name=form-album-description]", $modal).val(),
			privacy: $("[name=form-privacy]", $modal).val(),
			password: $("[name=form-privacy]", $modal).val() == "password" ? $("[name=form-album-password]", $modal).val() : null,
			new: true,
		}
	};
	return true;
};
APP.fn.complete_create_album = {
	success: function (XHR) {
		var response = XHR.responseJSON.album;
		window.location = response.url;
	},
	error: function (XHR) {
		var response = XHR.responseJSON;
		GO.fn.growl.call(GO.fn._s(response.error.message));
	}
};

// Upload edit (move to album or create new)
APP.fn.submit_upload_edit = function () {
	var $modal = $(GO.obj.modal.selectors.root),
		new_album = false;

	if ($("[data-content=form-new-album]", $modal).is(":visible") && $("[name=form-album-name]", $modal).val() == "") {
		GO.fn.growl.call(GO.fn._s("You must enter the album name."));
		$("[name=form-album-name]", $modal).highlight();
		return false;
	}

	if ($("[data-content=form-new-album]", $modal).is(":visible")) {
		new_album = true;
	}

	GO.obj.modal.form_data = {
		action: new_album ? "create-album" : "move",
		type: "images",
		album: {
			ids: $.map(APP.fn.uploader.results.success, function (v) {
				return v.image.id_encoded;
			}),
			new: new_album
		}
	};

	if (new_album) {
		GO.obj.modal.form_data.album.name = $("[name=form-album-name]", $modal).val();
		GO.obj.modal.form_data.album.description = $("[name=form-album-description]", $modal).val();
		GO.obj.modal.form_data.album.privacy = $("[name=form-privacy]", $modal).val();
		if (GO.obj.modal.form_data.album.privacy == "password") {
			GO.obj.modal.form_data.album.password = $("[name=form-album-password]", $modal).val();
		}
	} else {
		GO.obj.modal.form_data.album.id = $("[name=form-album-id]", $modal).val();
	}

	return true;
};
APP.fn.complete_upload_edit = {
	success: function (XHR) {
		var response = XHR.responseJSON.album;
		window.location = response.url;
	},
	error: function (XHR) {
		var response = XHR.responseJSON;
		GO.fn.growl.call(GO.fn._s(response.error.message));
	}
};

// Image edit
APP.fn.before_image_edit = function () {
	var $modal = $("[data-ajax-deferred='APP.fn.complete_image_edit']");
	$("[data-content=form-new-album]", $modal).hide();
	$("#move-existing-album", $modal).show();
};
APP.fn.submit_image_edit = function () {

	var $modal = $(GO.obj.modal.selectors.root),
		new_album = false;

	if ($("[data-content=form-new-album]", $modal).is(":visible") && $("[name=form-album-name]", $modal).val() == "") {
		GO.fn.growl.call(GO.fn._s("You must enter the album name."));
		$("[name=form-album-name]", $modal).highlight();
		return false;
	}

	if ($("[data-content=form-new-album]", $modal).is(":visible")) {
		new_album = true;
	}

	GO.obj.modal.form_data = {
		action: "edit",
		edit: "image",
		editing: {
			id: APP.obj.resource.id,
			category_id: $("[name=form-category-id]", $modal).val() || null,
			title: $("[name=form-image-title]", $modal).val() || null,
			description: $("[name=form-image-description]", $modal).val() || null,
			nsfw: $("[name=form-nsfw]", $modal).prop("checked") ? 1 : 0,
			new_album: new_album
		}
	};

	if (new_album) {
		GO.obj.modal.form_data.editing.album_privacy = $("[name=form-privacy]", $modal).val();
		if (GO.obj.modal.form_data.editing.album_privacy == "password") {
			GO.obj.modal.form_data.editing.album_password = $("[name=form-album-password]", $modal).val();
		}
		GO.obj.modal.form_data.editing.album_name = $("[name=form-album-name]", $modal).val();
		GO.obj.modal.form_data.editing.album_description = $("[name=form-album-description]", $modal).val();
	} else {
		GO.obj.modal.form_data.editing.album_id = $("[name=form-album-id]", $modal).val();
	}

	return true;

};
APP.fn.complete_image_edit = {
	success: function (XHR) {

		var response = XHR.responseJSON.image;

		if (!response.album.id_encoded) response.album.id_encoded = "";

		// Detect album change
		if (APP.obj.image_viewer.album.id_encoded !== response.album.id_encoded) {

			APP.obj.image_viewer.album.id_encoded = response.album.id_encoded;

			var slice = {
				html: response.album.slice && response.album.slice.html ? response.album.slice.html : null,
				prev: response.album.slice && response.album.slice.prev ? response.album.slice.prev : null,
				next: response.album.slice && response.album.slice.next ? response.album.slice.next : null
			};

			$("[data-content=album-slice]").html(slice.html);
			$("[data-content=album-panel-title]")[slice.html ? "show" : "hide"]();

			$("a[data-action=prev]").attr("href", slice.prev);
			$("a[data-action=next]").attr("href", slice.next);

			$("a[data-action]", ".image-viewer-navigation").each(function () {
				$(this)[typeof $(this).attr("href") == "undefined" ? "addClass" : "removeClass"]("hidden");
			});

		}

		APP.fn.resource_privacy_toggle(response.album.privacy);

		$.each(["description", "title"], function (i, v) {
			var $obj = $("[data-text=image-" + v + "]");
			$obj.html(GO.fn.nl2br(GO.fn.htmlEncode(response[v])));
			if ($obj.html() !== "") {
				$obj.show();
			}
		});

		APP.fn.common.updateDoctitle(response.title);

		GO.fn.growl.expirable(GO.fn._s("Image edited successfully."));

		// Add album to modals
		APP.fn.list_editor.addAlbumtoModals(response.album);

		// Reset modal
		var $modal = $("[data-submit-fn='APP.fn.submit_image_edit']");

		$.each(["description", "name", "password"], function (i, v) {
			var $input = $("[name=form-album-" + v + "]", $modal);
			if ($input.is("textarea")) {
				$input.val("").html("");
			} else {
				$input.val("").attr("value", "");
			}
		});
		$("[name=form-privacy] option", $modal).each(function () {
			$(this).removeAttr("selected");
		});
		$("[data-combo-value=password]", $modal).hide();

		// Select the album
		$("[name=form-album-id]", $modal).find("option").removeAttr("selected");
		$("[name=form-album-id]", $modal).find("[value=" + response.album.id_encoded + "]").attr("selected", true);

	}
};

// Album edit
APP.fn.before_album_edit = function (e) {
	var modal_source = "[data-before-fn='APP.fn.before_album_edit']";
	$("[data-action=album-switch]", modal_source).remove();

};
APP.fn.submit_album_edit = function () {
	var $modal = $(GO.obj.modal.selectors.root);

	if (!$("[name=form-album-name]", $modal).val()) {
		GO.fn.growl.call(GO.fn._s("You must enter the album name."));
		$("[name=form-album-name]", $modal).highlight();
		return false;
	}

	GO.obj.modal.form_data = {
		action: "edit",
		edit: "album",
		editing: {
			id: APP.obj.resource.id,
			name: $("[name=form-album-name]", $modal).val(),
			privacy: $("[name=form-privacy]", $modal).val(),
			description: $("[name=form-album-description]", $modal).val()
		}
	};
	if (GO.obj.modal.form_data.editing.privacy == "password") {
		GO.obj.modal.form_data.editing.password = $("[name=form-album-password]", $modal).val();
	}

	return true;

};
APP.fn.complete_album_edit = {

	success: function (XHR) {

		var album = XHR.responseJSON.album;

		$("[data-text=album-name]").html(GO.fn.htmlEncode(album.name));
		$("[data-text=album-description]").html(GO.fn.htmlEncode(album.description));
		APP.fn.resource_privacy_toggle(album.privacy);

		var stock = APP.obj.resource.type;
		APP.obj.resource.type = null;
		APP.fn.list_editor.updateItem($(".list-item"), XHR.responseJSON);
		APP.obj.resource.type = stock;

		$("[data-modal]").each(function () {
			$("option[value=" + album.id_encoded + "]", this).text(album.name + (album.privacy !== "public" ? ' (' + GO.fn._s("private") + ')' : ''));
		});

		APP.fn.common.updateDoctitle(album.name);

		GO.fn.growl.expirable(GO.fn._s("Album edited successfully."));

	}
};











// Category edit
APP.fn.category = {
	formFields: ["id", "name", "url_key", "description"],
	validateForm: function (id) {
		var modal = GO.obj.modal.selectors.root,
			submit = true,
			used_url_key = false;

		if (!APP.fn.common.validateForm(modal)) {
			return false;
		}

		if (/^[-\w]+$/.test($("[name=form-category-url_key]", modal).val()) === false) {
			GO.fn.growl.call(GO.fn._s("Invalid URL key."));
			$("[name=form-category-url_key]", modal).highlight();
			return false;
		}

		if (Object.size(APP.obj.categories) > 0) {
			$.each(APP.obj.categories, function (i, v) {
				if (typeof id !== "undefined" && v.id == id) return true;
				if (v.url_key == $("[name=form-category-url_key]", modal).val()) {
					used_url_key = true;
					return false;
				}
			});
		}
		if (used_url_key) {
			GO.fn.growl.call(GO.fn._s("Category URL key already being used."));
			$("[name=form-category-url_key]", modal).highlight();
			return false;
		}

		return true;
	},
	edit: {
		before: function (e) {
			var $this = $(e.target),
				id = $this.data("category-id"),
				category = APP.obj.categories[id],
				modal_source = "[data-modal=" + $this.data("target") + "]";
			$.each(APP.fn.category.formFields, function (i, v) {
				var i = "form-category-" + v,
					v = category[v],
					$input = $("[name=" + i + "]", modal_source);
				if ($input.is("textarea")) {
					$input.html(GO.fn.htmlEncode(v));
				} else {
					$input.attr("value", v);
				}
			});
		},
		submit: function () {
			var modal = GO.obj.modal.selectors.root,
				id = $("[name=form-category-id]", modal).val();

			if (!APP.fn.category.validateForm(id)) {
				return false;
			}

			GO.obj.modal.form_data = {
				action: "edit",
				edit: "category",
				editing: {}
			};
			$.each(APP.fn.category.formFields, function (i, v) {
				GO.obj.modal.form_data.editing[v] = $("[name=form-category-" + v + "]", modal).val();
			});

			return true;
		},
		complete: {
			success: function (XHR) {
				var category = XHR.responseJSON.category,
					parent = "[data-content=category][data-category-id=" + category.id + "]";

				$.each(category, function (i, v) {
					$("[data-content=category-" + i + "]", parent).html(GO.fn.htmlEncode(v));
				});

				$("[data-link=category-url]").attr("href", category.url);

				APP.obj.categories[category.id] = category;

			}
		}
	},
	delete: {
		before: function (e) {
			var $this = $(e.target),
				id = $this.data("category-id"),
				category = APP.obj.categories[id];
			$this.attr("data-confirm", $this.attr("data-confirm").replace("%s", '"' + category.name + '"'));
		},
		submit: function (id) {
			GO.obj.modal.form_data = {
				action: "delete",
				delete: "category",
				deleting: {
					id: id
				}
			};
			return true;
		},
		complete: {
			success: function (XHR) {
				GO.fn.growl.expirable(GO.fn._s("Category successfully deleted."));
				var id = XHR.responseJSON.request.deleting.id;
				$("[data-content=category][data-category-id=" + id + "]").remove();

				delete APP.obj.categories[id];
			}
		}
	},
	add: {
		submit: function () {

			var modal = GO.obj.modal.selectors.root;

			if (!APP.fn.category.validateForm()) {
				return false;
			}

			GO.obj.modal.form_data = {
				action: "add-category",
				category: {}
			};
			$.each(APP.fn.category.formFields, function (i, v) {
				if (v == "id") return;
				GO.obj.modal.form_data.category[v] = $("[name=form-category-" + v + "]", modal).val();
			});

			return true;
		},
		complete: {
			success: function (XHR) {
				var category = XHR.responseJSON.category,
					list = "[data-content=dashboard-categories-list]",
					html = $("[data-content=category-dashboard-template]").html(),
					replaces = {};

				$.each(category, function (i, v) {
					html = html.replace(new RegExp("%" + i.toUpperCase() + "%", "g"), v ? v : "");
				});

				$(list).append(html);

				if (Object.size(APP.obj.categories) == 0) {
					APP.obj.categories = {};
				}
				APP.obj.categories[category.id] = category;

				GO.fn.growl.call(GO.fn._s("Category %s added.", '"' + category.name + '"'));
			}
		}
	}
};

// IP ban edit
APP.fn.ip_ban = {
	formFields: ["id", "ip", "expires", "message"],
	validateForm: function (id) {

		var modal = GO.obj.modal.selectors.root,
			submit = true,
			already_banned = false,
			ip = $("[name=form-ip_ban-ip]", modal).val();

		if (!APP.fn.common.validateForm(modal)) {
			return false;
		}

		if ($("[name=form-ip_ban-expires]", modal).val() !== "" && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test($("[name=form-ip_ban-expires]", modal).val()) == false) {
			GO.fn.growl.call(GO.fn._s("Invalid expiration date."));
			$("[name=form-ip_ban-expires]", modal).highlight();
			return false;
		}

		if (Object.size(APP.obj.ip_bans) > 0) {
			$.each(APP.obj.ip_bans, function (i, v) {
				if (typeof id !== "undefined" && v.id == id) return true;
				if (v.ip == ip) {
					already_banned = true;
					return false;
				}
			});
		}
		if (already_banned) {
			GO.fn.growl.call(GO.fn._s("IP %s already banned.", ip));
			$("[name=form-ip_ban-ip]", modal).highlight();
			return false;
		}

		return true;
	},

	add: {
		submit: function () {

			var modal = GO.obj.modal.selectors.root;

			if (!APP.fn.ip_ban.validateForm()) {
				return false;
			}

			GO.obj.modal.form_data = {
				action: "add-ip_ban",
				ip_ban: {}
			};
			$.each(APP.fn.ip_ban.formFields, function (i, v) {
				if (v == "id") return;
				GO.obj.modal.form_data.ip_ban[v] = $("[name=form-ip_ban-" + v + "]", modal).val();
			});

			return true;
		},
		complete: {
			success: function (XHR) {

				var ip_ban = XHR.responseJSON.ip_ban,
					list = "[data-content=dashboard-ip_bans-list]",
					html = $("[data-content=ip_ban-dashboard-template]").html(),
					replaces = {};

				if (typeof html !== "undefined") {
					$.each(ip_ban, function (i, v) {
						html = html.replace(new RegExp("%" + i.toUpperCase() + "%", "g"), v ? v : "");
					});
					$(list).append(html);
				}

				if (Object.size(APP.obj.ip_bans) == 0) {
					APP.obj.ip_bans = {};
				}
				APP.obj.ip_bans[ip_ban.id] = ip_ban;

				$("[data-content=ban_uploader_ip]").hide();
				$("[data-content=banned_uploader_ip]").show();

				GO.fn.growl.call(GO.fn._s("IP %s banned.", ip_ban.ip));

			},
			error: function (XHR) { // experimental
				var error = XHR.responseJSON.error;
				GO.fn.growl.call(GO.fn._s(error.message));
			}
		}
	},

	edit: {
		before: function (e) {
			var $this = $(e.target),
				id = $this.data("ip_ban-id"),
				target = APP.obj.ip_bans[id],
				modal_source = "[data-modal=" + $this.data("target") + "]";
			$.each(APP.fn.ip_ban.formFields, function (i, v) {
				var i = "form-ip_ban-" + v,
					v = target[v],
					$input = $("[name=" + i + "]", modal_source);
				if ($input.is("textarea")) {
					$input.html(GO.fn.htmlEncode(v));
				} else {
					$input.attr("value", v);
				}
			});
		},
		submit: function () {
			var modal = GO.obj.modal.selectors.root,
				id = $("[name=form-ip_ban-id]", modal).val();

			if (!APP.fn.ip_ban.validateForm(id)) {
				return false;
			}

			GO.obj.modal.form_data = {
				action: "edit",
				edit: "ip_ban",
				editing: {}
			};
			$.each(APP.fn.ip_ban.formFields, function (i, v) {
				GO.obj.modal.form_data.editing[v] = $("[name=form-ip_ban-" + v + "]", modal).val();
			});

			return true;
		},
		complete: {
			success: function (XHR) {
				var ip_ban = XHR.responseJSON.ip_ban,
					parent = "[data-content=ip_ban][data-ip_ban-id=" + ip_ban.id + "]";

				$.each(ip_ban, function (i, v) {
					$("[data-content=ip_ban-" + i + "]", parent).html(GO.fn.htmlEncode(v));
				});
				APP.obj.ip_bans[ip_ban.id] = ip_ban;
			},
			error: function (XHR) {
				var error = XHR.responseJSON.error;
				GO.fn.growl.call(GO.fn._s(error.message));
			}
		}
	},

	delete: {
		before: function (e) {
			var $this = $(e.target),
				id = $this.data("ip_ban-id"),
				ip_ban = APP.obj.ip_bans[id];
			$this.attr("data-confirm", $this.attr("data-confirm").replace("%s", ip_ban.ip));
		},
		submit: function (id) {
			GO.obj.modal.form_data = {
				action: "delete",
				delete: "ip_ban",
				deleting: {
					id: id
				}
			};
			return true;
		},
		complete: {
			success: function (XHR) {
				GO.fn.growl.expirable(GO.fn._s("IP ban successfully deleted."));
				var id = XHR.responseJSON.request.deleting.id;
				$("[data-content=ip_ban][data-ip_ban-id=" + id + "]").remove();

				delete APP.obj.ip_bans[id];
			}
		}
	}
};

// Storage edit
APP.fn.storage = {
	formFields: ["id", "name", "api_id", "bucket", "server", "service", "capacity", "region", "key", "secret", "url", "account_id", "account_name"],
	calling: false,
	validateForm: function () {

		var modal = GO.obj.modal.selectors.root,
			id = $("[name=form-storage-id]", modal).val(),
			submit = true;

		$.each($(":input", modal), function (i, v) {
			if ($(this).is(":hidden")) {
				if ($(this).attr("required")) {
					$(this).removeAttr("required").attr("data-required", 1);
				}
			} else {
				if ($(this).attr("data-required") == 1) {
					$(this).attr("required", "required");
				}
			}
			if ($(this).is(":visible") && $(this).val() == "" && $(this).attr("required")) {
				$(this).highlight();
				submit = false;
			}
		});

		if (!submit) {
			GO.fn.growl.call(GO.fn._s("Please fill all the required fields."));
			return false;
		}

		// Validate storage capacity
		var $storage_capacity = $("[name=form-storage-capacity]", modal),
			storage_capacity = $storage_capacity.val(),
			capacity_error_msg;

		if (storage_capacity !== "") {
			if (/^[\d\.]+\s*[A-Za-z]{2}$/.test(storage_capacity) == false || typeof storage_capacity.getBytes() == "undefined") {
				capacity_error_msg = GO.fn._s("Invalid storage capacity value. Make sure to use a valid format.");
			} else if (typeof APP.obj.storages[id] !== "undefined" && storage_capacity.getBytes() < APP.obj.storages[id].space_used) {
				capacity_error_msg = GO.fn._s("Storage capacity can't be lower than its current usage (%s).", APP.obj.storages[id].space_used.formatBytes());
			}
			if (capacity_error_msg) {
				GO.fn.growl.call(capacity_error_msg);
				$storage_capacity.highlight();
				return false;
			}
		}

		if (/^https?:\/\/.+$/.test($("[name=form-storage-url]", modal).val()) == false) {
			GO.fn.growl.call(GO.fn._s("Invalid URL."));
			$("[name=form-storage-url]", modal).highlight();
			return false;
		}
		return true;
	},
	toggleHttps: function (id) {
		this.toggleBool(id, "https");
	},
	toggleActive: function (id) {
		this.toggleBool(id, "active");
	},
	toggleBool: function (id, string) {

		if (this.calling) return;

		this.calling = true;

		var $root = $("[data-storage-id=" + id + "]"),
			$parent = $("[data-content=storage-" + string + "]", $root),
			$el = $("[data-checkbox]", $parent),
			checked = APP.obj.storages[id]["is_" + string],
			toggle = checked == 0 ? 1 : 0,
			data = {
				action: "edit",
				edit: "storage",
				editing: {
					id: id
				}
			};
		data.editing["is_" + string] = toggle;
		if (string == "https") {
			data.editing.url = APP.obj.storages[id].url;
		}

		GO.fn.loading.fullscreen();

		$.ajax({
				type: "POST",
				data: data
			})
			.always(function (data, status, XHR) {

				APP.fn.storage.calling = false;
				GO.fn.loading.destroy("fullscreen");

				if (typeof data.storage == "undefined") {
					GO.fn.growl.call(data.responseJSON.error.message);
					return;
				}

				var storage = data.storage;
				APP.obj.storages[storage.id] = storage;

				GO.fn.growl.expirable(GO.fn._s("Storage successfully edited."));

				switch (string) {
					case "https":
						$("[data-content=storage-url]", $root).html(storage.url);
						break;
				}

				APP.fn.storage.toggleBoolDisplay($el, toggle);

				APP.fn.queuePixel(); // For the lulz
			});
	},
	edit: {
		before: function (e) {
			var $this = $(e.target),
				id = $this.data("storage-id"),
				storage = APP.obj.storages[id],
				modal_source = "[data-modal=" + $this.data("target") + "]",
				combo = "[data-combo-value~=" + storage['api_id'] + "]";

			$.each(APP.fn.storage.formFields, function (i, v) {
				var i = "form-storage-" + v,
					v = storage[v],
					$combo_input = $(combo + " [name=" + i + "]", modal_source),
					$global_input = $("[name=" + i + "]", modal_source),
					$input = $combo_input.exists() ? $combo_input : $global_input;
				if ($input.is("textarea")) {
					$input.html(GO.fn.htmlEncode(v));
				} else if ($input.is("select")) {
					$("option", $input).removeAttr("selected");
					$("option", $input).each(function () {
						if ($(this).attr("value") == v) {
							$(this).attr("selected", "selected");
							return false;
						}
					});
				} else {
					if ($input.is("[name=form-storage-capacity]") && typeof v !== "undefined" && v > 0) {
						v = v.formatBytes(2);
					}
					$input.attr("value", v);
				}
			});

			// Co-combo breaker
			$("[data-combo-value]").addClass("soft-hidden");
			$(combo).removeClass("soft-hidden");

		},
		submit: function () {
			var modal = GO.obj.modal.selectors.root,
				id = $("[name=form-storage-id]", modal).val(),
				used_url_key = false;

			if (!APP.fn.storage.validateForm()) {
				return false;
			}

			GO.obj.modal.form_data = {
				action: "edit",
				edit: "storage",
				editing: {}
			};
			$.each(APP.fn.storage.formFields, function (i, v) {
				var sel;
				sel = "[name=form-storage-" + v + "]";
				if ($(sel, modal).attr("type") !== "hidden") {
					sel += ":visible";
				}
				GO.obj.modal.form_data.editing[v] = $(sel, modal).val();
			});

			return true;

		},
		complete: {
			success: function (XHR) {
				var storage = XHR.responseJSON.storage,
					parent = "[data-content=storage][data-storage-id=" + storage.id + "]",
					$el = $("[data-action=toggle-storage-https]", parent);
				$.each(storage, function (i, v) {
					$("[data-content=storage-" + i + "]", parent).html(GO.fn.htmlEncode(v));
				});
				APP.obj.storages[storage.id] = storage;
				APP.fn.storage.toggleBoolDisplay($el, storage['is_https'] == 1);
				APP.fn.queuePixel(); // For the lulz
			},
			error: function (XHR) {
				var response = XHR.responseJSON,
					message = response.error.message;
				GO.fn.growl.call(message);
			}
		}
	},
	add: {
		submit: function () {
			if (!APP.fn.storage.validateForm()) {
				return false;
			}
			var modal = GO.obj.modal.selectors.root;

			GO.obj.modal.form_data = {
				action: "add-storage",
				storage: {}
			};
			$.each(APP.fn.storage.formFields, function (i, v) {
				if (v == "id") return;
				var sel;
				sel = "[name=form-storage-" + v + "]";
				if ($(sel, modal).attr("type") !== "hidden") {
					sel += ":visible";
				}
				GO.obj.modal.form_data.storage[v] = $(sel, modal).val();
			});

			return true;
		},
		complete: {
			success: function (XHR) {
				var storage = XHR.responseJSON.storage,
					list = "[data-content=dashboard-storages-list]",
					html = $("[data-content=storage-dashboard-template]").html(),
					replaces = {};

				$.each(storage, function (i, v) {
					var upper = i.toUpperCase();
					if (i == "is_https" || i == "is_active") {
						var v = APP.obj.storageTemplate.icon.replace("%TITLE%", APP.obj.storageTemplate.messages[i]).replace("%ICON%", APP.obj.storageTemplate.checkboxes[v]).replace("%PROP%", i.replace("is_", ""));
					}
					html = html.replace(new RegExp("%" + upper + "%", "g"), v ? v : "");
				});

				$(list).append(html);

				GO.fn.bindtipTip($("[data-storage-id=" + storage.id + "]"));

				if (APP.obj.storages.length == 0) {
					APP.obj.storages = {};
				}
				APP.obj.storages[storage.id] = storage;

				APP.fn.queuePixel(); // For the lulz

			},
			error: function (XHR) {
				var response = XHR.responseJSON,
					message = response.error.message;
				GO.fn.growl.call(message);
			}
		}
	},
	toggleBoolDisplay: function ($el, toggle) {
		var icons = {
			0: $el.data("unchecked-icon"),
			1: $el.data("checked-icon")
		};
		$el.removeClass(icons[0] + " " + icons[1]).addClass(icons[toggle ? 1 : 0]);
	}
};

APP.fn.common = {
	validateForm: function (modal) {
		if (typeof modal == "undefined") {
			var modal = GO.obj.modal.selectors.root;
		}

		var submit = true;

		$.each($(":input:visible", modal), function (i, v) {
			if ($(this).val() == "" && $(this).attr("required")) {
				$(this).highlight();
				submit = false;
			}
		});
		if (!submit) {
			GO.fn.growl.call(GO.fn._s("Please fill all the required fields."));
			return false;
		}

		return true;
	},
	updateDoctitle: function (pre_doctitle) {
		if (typeof APP.obj.page_info !== typeof undefined) {
			APP.obj.page_info.pre_doctitle = pre_doctitle;
			APP.obj.page_info.doctitle = APP.obj.page_info.pre_doctitle + APP.obj.page_info.pos_doctitle;
			document.title = APP.obj.page_info.doctitle;
		}
	}
};

APP.fn.user = {
	add: {
		submit: function () {
			var $modal = $(GO.obj.modal.selectors.root),
				submit = true;

			$.each($(":input", $modal), function (i, v) {
				if ($(this).val() == "" && $(this).attr("required")) {
					$(this).highlight();
					submit = false;
				}
			});

			if (!submit) {
				GO.fn.growl.call(GO.fn._s("Please fill all the required fields."));
				return false;
			}

			GO.obj.modal.form_data = {
				action: "add-user",
				user: {
					username: $("[name=form-username]", $modal).val(),
					email: $("[name=form-email]", $modal).val(),
					password: $("[name=form-password]", $modal).val(),
					role: $("[name=form-role]", $modal).val()
				}
			};

			return true;
		},
		complete: {
			success: function (XHR) {
				var response = XHR.responseJSON;
				GO.fn.growl.expirable(GO.fn._s("User added successfully."));
			},
			error: function (XHR) {
				var response = XHR.responseJSON;
				GO.fn.growl.call(GO.fn._s(response.error.message));
			}
		}
	},
	delete: {
		submit: function () {
			GO.obj.modal.form_data = {
				action: "delete",
				delete: "user",
				owner: APP.obj.resource.user.id,
				deleting: APP.obj.resource.user
			};
			return true;
		}
	}
};

// Resource delete
APP.fn.submit_resource_delete = function () {
	GO.obj.modal.form_data = {
		action: "delete",
		delete: APP.obj.resource.type,
		from: "resource",
		owner: typeof APP.obj.resource.user !== "undefined" ? APP.obj.resource.user.id : null,
		deleting: APP.obj.resource
	};
	return true;
};
APP.fn.complete_resource_delete = {
	success: function (XHR) {
		var response = XHR.responseJSON;
		$("body").fadeOut("normal", function () {
			var redir;
			if (APP.obj.resource.type == "album" || APP.obj.resource.type == "image") {
				redir = APP.obj.resource.parent_url;
			} else {
				redir = APP.obj.resource.user ? APP.obj.resource.user.url : APP.obj.resource.url;
			}
			if (typeof redir !== "undefined") {
				window.location = redir + "?deleted";
			}
		});
	}
};

APP.fn.list_editor = {

	// viewerPropagate: function($item, fn, obj) {
	// 	if(fn == ) {
	//
	// 	}
	// },

	// Update all the selection counts
	selectionCount: function () {

		var $content_listing = $(GO.obj.listing.selectors.content_listing);

		$content_listing.each(function () {

			var $listing_options = $("[data-content=pop-selection]", "[data-content=list-selection][data-tab=" + $(this).attr("id") + "]"),
				selection_count = $(GO.obj.listing.selectors.list_item + ".selected", this).length;
			all_count = $(GO.obj.listing.selectors.list_item, this).length;

			$listing_options[selection_count > 0 ? "removeClass" : "addClass"]("disabled");
			$("[data-text=selection-count]", $listing_options).text(selection_count > 0 ? selection_count : "");

			// Sensitive display
			if ($content_listing.data('list') == 'images' && selection_count > 0) {
				var has_sfw = $(GO.obj.listing.selectors.list_item + ".selected[data-flag=safe]", this).length > 0,
					has_nsfw = $(GO.obj.listing.selectors.list_item + ".selected[data-flag=unsafe]", this).length > 0;
				$("[data-action=flag-safe]", $listing_options)[(has_nsfw ? "remove" : "add") + "Class"]("hidden");
				$("[data-action=flag-unsafe]", $listing_options)[(has_sfw ? "remove" : "add") + "Class"]("hidden");
			}

			if ($(this).is(":visible")) {
				APP.fn.list_editor.listMassActionSet(all_count == selection_count ? "clear" : "select");
			}
		});

	},

	// Remove (delete or move) items from list
	removeFromList: function ($target, msg) {

		if (typeof $target == "undefined") return;

		var $target = $target instanceof jQuery == false ? $($target) : $target,
			$content_listing = $(GO.obj.listing.selectors.content_listing_visible),
			target_size = $target.length;

		$target.fadeOut("fast"); // Promise

		// Update counts
		var type = $target.first().data("type"),
			new_count = parseInt($("[data-text=" + type + "-count]").text()) - target_size;

		APP.fn.list_editor.updateUserCounters($target.first().data("type"), target_size, "-");

		$target.promise().done(function () {

			$(document).removeClass(APP.fn.listingViewer.selectors.bodyShown.substr(1));

			// Get count related to each list
			var affected_content_lists = {};
			$target.each(function () {
				$("[data-id=" + $(this).data("id") + "]").each(function () {
					var list_id = $(this).closest(GO.obj.listing.selectors.content_listing).attr("id");

					if (!affected_content_lists[list_id]) {
						affected_content_lists[list_id] = 0;
					}
					affected_content_lists[list_id] += 1;
				});
			});

			if (target_size == 1) {
				$("[data-id=" + $(this).data("id") + "]").remove();
			} else {
				$target.each(function () {
					$("[data-id=" + $(this).data("id") + "]").remove();
				});
			}

			GO.fn.listing.columnizerQueue();
			GO.fn.listing.refresh();

			APP.fn.list_editor.selectionCount();

			if (typeof msg !== "undefined" && typeof msg == "string") {
				GO.fn.growl.expirable(msg);
			}

			// Update offset list (+stock)
			for (var k in affected_content_lists) {
				var $list = $("#" + k),
					stock_offset = $list.data("offset"),
					offset = -affected_content_lists[k];

				stock_offset = (typeof stock_offset == "undefined") ? 0 : parseInt(stock_offset);

				$list.data("offset", stock_offset + offset);
			}

			if (!$(GO.obj.listing.selectors.content_listing_pagination, $content_listing).exists() && $(".list-item", $content_listing).length == 0) {
				new_count = 0;
			}

			// On zero add the empty template
			if (new_count == 0) {
				$content_listing.html(GO.obj.listing.template.empty);
				// Reset ajaxed status of all
				$(GO.obj.listing.selectors.content_listing + ":not(" + GO.obj.listing.selectors.content_listing_visible + ")").data({
					empty: null,
					load: "ajax"
				});
				$("[data-content=list-selection][data-tab=" + $content_listing.attr("id") + "]").addClass("disabled");
			} else {
				// Count isn't zero.. But the view?
				if ($(GO.obj.listing.selectors.list_item, $content_listing).length == 0) {
					$(GO.obj.listing.selectors.pad_content).height(0);
					$content_listing.find("[data-action=load-more]").click();
					GO.obj.listing.recolumnize = true;
				}

			}

		});
	},

	deleteFromList: function ($target) {
		if (typeof growl == "undefined") {
			var growl = true;
		}
		var $target = $target instanceof jQuery == false ? $($target) : $target;
		this.removeFromList($target, growl ? GO.fn._s("The content has been deleted.") : null);
	},

	moveFromList: function ($target, growl) {
		if (typeof growl == "undefined") {
			var growl = true;
		}
		var $target = $target instanceof jQuery == false ? $($target) : $target;
		this.removeFromList($target, growl ? GO.fn._s("The content has been moved.") : null);
	},

	toggleSelectItem: function ($list_item, select) {
		if (typeof select !== "boolean") {
			var select = true;
		}

		var $target = $(".viewer").is(":visible") ? $("[data-type=image][data-id=" + $list_item.attr("data-id") + "]") : $list_item;
		var $icon = $("[data-action=select] .btn-icon", $target);
		var add_class, remove_class, label_text;

		if (!select) {
			$target.removeClass("selected");
			add_class = $icon.data("icon-unselected");
			remove_class = $icon.data("icon-selected");
			label_text = GO.fn._s("Select");

		} else {
			$target.addClass("selected");
			add_class = $icon.data("icon-selected");
			remove_class = $icon.data("icon-unselected");
			label_text = GO.fn._s("Unselect");
		}

		$icon.removeClass(remove_class).addClass(add_class);

		$("[data-action=select] .label", $target).text(label_text);


		APP.fn.list_editor.selectionCount();
	},
	selectItem: function ($list_item) {
		this.toggleSelectItem($list_item, true);
	},
	unselectItem: function ($list_item) {
		this.toggleSelectItem($list_item, false);
	},

	clearSelection: function (all) {
		var $targets = $(GO.obj.listing.selectors.list_item + ".selected", GO.obj.listing.selectors[all ? "content_listing" : "content_listing_visible"]);
		this.unselectItem($targets);
		this.listMassActionSet("select");
	},

	listMassActionSet: function (action) {
		var current = action == "select" ? "clear" : "select";
		var $target = $("[data-action=list-" + current + "-all]:visible");
		var text = $target.data("text-" + action + "-all");
		$target.text(text).attr("data-action", "list-" + action + "-all");
	},

	updateItem: function ($target, response, action, growl) {
		if ($target instanceof jQuery == false) {
			var $target = $($target);
		}

		var dealing_with = $target.data("type"),
			album = dealing_with == "image" ? response.album : response;

		this.addAlbumtoModals(album);

		$("option[value=" + album.id_encoded + "]", "[name=form-album-id]").html(GO.fn.htmlEncode(album.name_with_privacy_readable_html));

		if (typeof action == "undefined") {
			var action = "edit";
		}

		if (action == "edit" || action == "move") {
			if (action == "move" && APP.obj.resource.type == "album") {
				APP.fn.list_editor.moveFromList($target, growl);
				return;
			}
			$target.attr("data-description", response.description);

			if (dealing_with == "image") {
				if (typeof response.title !== typeof undefined) {
					$target.attr("data-title", response.title);
					$target.find("[title]").attr("title", response.title);
					$("[data-text=image-title]", $target).html(GO.fn.htmlEncode(response.title));
				}
				if (typeof response.title_truncated !== typeof undefined) {
					$("[data-text=image-title-truncated]", $target).html(GO.fn.htmlEncode(response.title_truncated));
				}
				if (typeof response.category_id !== typeof undefined) {
					$target.attr("data-category-id", response.category_id);
				}
				$target.attr({
					"data-album-id": album.id_encoded,
					"data-flag": response.nsfw == 1 ? "unsafe" : "safe"
				});
				$("[data-content=album-link]", $target).attr("href", album.url);
			} else {
				$target.attr({
					"data-privacy": album.privacy,
					"data-password": album.password,
					"data-name": album.name,
				});
			}
			$target.attr("data-privacy", album.privacy);
			$("[data-text=album-name]", $target).html(GO.fn.htmlEncode(album.name));

			GO.fn.growl.expirable(action == "edit" ? GO.fn._s("The content has been edited.") : GO.fn._s("The content has been moved."));
		}
	},

	addAlbumtoModals: function (album) {
		var added = false;
		$("[name=form-album-id]", "[data-modal]").each(function () {
			if (album.id_encoded && !$("option[value=" + album.id_encoded + "]", this).exists()) {
				$(this).append('<option value="' + album.id_encoded + '">' + album.name_with_privacy_readable_html + '</option>');
				added = true;
			}
		});
		if (added) {
			APP.fn.list_editor.updateUserCounters("album", 1, "+");
		}
	},

	updateAlbum: function (album) {
		$("[data-id=" + album.id_encoded + "]").each(function () {
			if (album.html !== "") {
				$(this).after(album.html);
				$(this).remove();
			}
		});
	},

	updateUserCounters: function (counter, number, operation) {

		if (typeof operation == "undefined") {
			var operation = "+";
		}

		// Current resource counter
		var $count = $("[data-text=" + counter + "-count]"),
			$count_label = $("[data-text=" + counter + "-label]"),
			number = parseInt(number),
			old_count = parseInt($count.html()),
			new_count,
			delta;

		switch (operation) {
			case "+":
				new_count = old_count + number;
				break;
			case "-":
				new_count = old_count - number;
				break;
			case "=":
				new_count = number;
				break;
		}

		delta = new_count - old_count;

		// Total counter
		var $total_count = $("[data-text=total-" + $count.data("text") + "]"),
			$total_count_label = $("[data-text=" + $total_count.data("text") + "-label]"),
			old_total_count = parseInt($total_count.html()),
			new_total_count = old_total_count + delta;

		$count.text(new_count);
		$total_count.text(new_total_count);
		$count_label.text($count_label.data(new_count == 1 ? "label-single" : "label-plural"));
		$total_count_label.text($count_label.data(new_total_count == 1 ? "label-single" : "label-plural"));

	},

	updateMoveItemLists: function (response, dealing_with, $targets) {

		APP.fn.list_editor.clearSelection();

		if (/image/.test(dealing_with)) {

			if (dealing_with == "image") { // single
				APP.fn.list_editor.updateItem("[data-type=image][data-id=" + $targets.data("id") + "]", response.image, "move");
			} else {
				$targets.each(function () {
					APP.fn.list_editor.updateItem("[data-type=" + dealing_with + "][data-id=" + $(this).data("id") + "]", response, "move", false);
				});
				GO.fn.growl.expirable(GO.fn._s("The content has been moved."));
			}

		} else {

			// /album?
			if (APP.obj.resource.type == "album") {
				APP.fn.list_editor.moveFromList($targets);
			} else {
				GO.fn.growl.expirable(GO.fn._s("The content has been moved."));
			}

			if (typeof response.albums_old !== "undefined") {
				for (var i = 0; i < response.albums_old.length; i++) {
					APP.fn.list_editor.updateAlbum(response.albums_old[i]);
				}
			} else {
				APP.fn.list_editor.updateAlbum(response.old_album);
			}

			if (response.album) {

				// New album
				if (typeof response.albums_old !== "undefined" ? response.request.album.new == "true" : response.request.editing.new_album == "true") {

					// Add option select to modals
					APP.fn.list_editor.addAlbumtoModals(response.album);

					var old_count = parseInt($("[data-text=album-count]").text()) - 1;

					$(GO.obj.listing.selectors.pad_content).each(function () {

						var list_count = $(this).find(GO.obj.listing.selectors.list_item).length;

						if (list_count == 0) {
							return;
						}

						var params = GO.fn.deparam($(this).closest(GO.obj.listing.selectors.content_listing).data("params"));

						if (params.sort == "date_desc" || old_count == list_count) {
							$(this)[params.sort == "date_desc" ? "prepend" : "append"](response.album.html);
						}

					});
				} else {
					APP.fn.list_editor.updateAlbum(response.album);
				}
			}

			GO.fn.listing.columnizerQueue();
			GO.fn.listing.refresh(0);
		}

	}

};

// Queuezier!
APP.fn.queuePixel = function () {
	var img = '<img data-content="queue-pixel" src="' + GO.obj.config.base_url + '/?queue&r=' + GO.fn.generate_random_string(32) + '" width="1" height="1" alt="" style="display: none;">';
	$("body").append(img);
};