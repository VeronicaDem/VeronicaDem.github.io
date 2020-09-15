/*!     go-comments.js 1.4.0
 *
 *     (c) 2017 Joona Tykkyläinen, Viima Solutions Oy
 *     go-comments may be freely distributed under the MIT license.
 *     For all details and documentation:
 *     http://viima.github.io/go-comments/
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function(root, jQuery) {
            if (jQuery === undefined) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {

    var Comments = {

        // Instance variables
        // ==================
        
        $el: null,
        commentsById: {},
        dataFetched: false,
        currentSortKey: '',
        options: {},
        events: {
            // Close dropdowns
            'click': 'closeDropdowns',

            // Save comment on keydown
            'keydown [contenteditable]' : 'saveOnKeydown',

            // Listening changes in contenteditable fields (due to input event not working with IE)
            'focus [contenteditable]' : 'saveEditableContent',
            'keyup [contenteditable]' : 'checkEditableContentForChange',
            'paste [contenteditable]' : 'checkEditableContentForChange',
            'input [contenteditable]' : 'checkEditableContentForChange',
            'blur [contenteditable]' : 'checkEditableContentForChange',

            // Navigation
            'click .navigation li[data-sort-key]' : 'navigationElementClicked',
            'click .navigation li.title' : 'toggleNavigationDropdown',

            // Main comenting field
            'click .commenting-field.main .textarea': 'showMainCommentingField',
            'click .commenting-field.main .close' : 'hideMainCommentingField',

            // All commenting fields
            'click .commenting-field .textarea' : 'increaseTextareaHeight',
            'change .commenting-field .textarea' : 'increaseTextareaHeight textareaContentChanged',
            'click .commenting-field:not(.main) .close' : 'removeCommentingField',

            // Edit mode actions
            'click .commenting-field .send.enabled' : 'postComment',
            'click .commenting-field .update.enabled' : 'putComment',
            'click .commenting-field .delete.enabled' : 'deleteComment',
            'change .commenting-field .upload.enabled input[type="file"]' : 'fileInputChanged', //#

            // Other actions
            'click li.comment button.upvote' : 'upvoteComment',
            'click li.comment button.delete.enabled' : 'deleteComment',
            'click li.comment .hashtag' : 'hashtagClicked',
            'click li.comment .ping' : 'pingClicked',

            // Other
            'click li.comment ul.child-comments .toggle-all': 'toggleReplies',
            'click li.comment button.reply': 'replyButtonClicked',
            'click li.comment button.edit': 'editButtonClicked',

            // Drag & dropping attachments
            'dragenter' : 'showDroppableOverlay',

            'dragenter .droppable-overlay' : 'handleDragEnter',
            'dragleave .droppable-overlay' : 'handleDragLeaveForOverlay',
            'dragenter .droppable-overlay .droppable' : 'handleDragEnter',
            'dragleave .droppable-overlay .droppable' : 'handleDragLeaveForDroppable',

            'dragover .droppable-overlay' : 'handleDragOverForOverlay',
            'drop .droppable-overlay' : 'handleDrop',

            // Prevent propagating the click event into buttons under the autocomplete dropdown
            'click .dropdown.autocomplete': 'stopPropagation',
            'mousedown .dropdown.autocomplete': 'stopPropagation',
            'touchstart .dropdown.autocomplete': 'stopPropagation',



            // plugin load media
            'click span.upload' : 'showSheetModal',
            'change input[type="file"]' : 'fileInputChanged', 
            'click span.close-modal' : 'showDynamicSheetModal'
            // processFile => previewFile => showPreviews 
            // loadFiles @param files : array, for file in files loadFile(file) with onSuccess, onError   
            // loadFiles with cascade mode : Promise.all
            // requestOnFile with sequence mode, with ignore mode
        },
        // plugin load media
        filesInCommentingField: {}, 
        dynamicSheetModal : null,
        dynamicPopup: null,
        preloader: `
         <span class="loading-indicator" style="width: 30px; height: 30px; position: absolute; top: 50%; left: 50%; margin-top: -15px; margin-left: -15px;"><div class="spinner" style="position: relative; width: 0px; z-index: auto; left: 15px; top: 15px;" role="progressbar"><div style="position: absolute; top: -2px; opacity: 0.25; animation: 1s linear 0s infinite normal none running opacity-45-25-0-11;"><div style="position: absolute; width: 5px; height: 5px; background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 4px; transform-origin: left center 0px; transform: rotate(0deg) translate(10px); border-radius: 2px; top: 2px;"></div><div style="position: absolute; width: 5px; height: 5px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px; transform-origin: left center 0px; transform: rotate(0deg) translate(10px); border-radius: 2px;"></div></div><div style="position: absolute; top: -2px; opacity: 0.25; animation: 1s linear 0s infinite normal none running opacity-45-25-1-11;"><div style="position: absolute; width: 5px; height: 5px; background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 4px; transform-origin: left center 0px; transform: rotate(32deg) translate(10px); border-radius: 2px; top: 2px;"></div><div style="position: absolute; width: 5px; height: 5px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px; transform-origin: left center 0px; transform: rotate(32deg) translate(10px); border-radius: 2px;"></div></div><div style="position: absolute; top: -2px; opacity: 0.25; animation: 1s linear 0s infinite normal none running opacity-45-25-2-11;"><div style="position: absolute; width: 5px; height: 5px; background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 4px; transform-origin: left center 0px; transform: rotate(65deg) translate(10px); border-radius: 2px; top: 2px;"></div><div style="position: absolute; width: 5px; height: 5px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px; transform-origin: left center 0px; transform: rotate(65deg) translate(10px); border-radius: 2px;"></div></div><div style="position: absolute; top: -2px; opacity: 0.25; animation: 1s linear 0s infinite normal none running opacity-45-25-3-11;"><div style="position: absolute; width: 5px; height: 5px; background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 4px; transform-origin: left center 0px; transform: rotate(98deg) translate(10px); border-radius: 2px; top: 2px;"></div><div style="position: absolute; width: 5px; height: 5px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px; transform-origin: left center 0px; transform: rotate(98deg) translate(10px); border-radius: 2px;"></div></div><div style="position: absolute; top: -2px; opacity: 0.25; animation: 1s linear 0s infinite normal none running opacity-45-25-4-11;"><div style="position: absolute; width: 5px; height: 5px; background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 4px; transform-origin: left center 0px; transform: rotate(130deg) translate(10px); border-radius: 2px; top: 2px;"></div><div style="position: absolute; width: 5px; height: 5px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px; transform-origin: left center 0px; transform: rotate(130deg) translate(10px); border-radius: 2px;"></div></div><div style="position: absolute; top: -2px; opacity: 0.25; animation: 1s linear 0s infinite normal none running opacity-45-25-5-11;"><div style="position: absolute; width: 5px; height: 5px; background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 4px; transform-origin: left center 0px; transform: rotate(163deg) translate(10px); border-radius: 2px; top: 2px;"></div><div style="position: absolute; width: 5px; height: 5px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px; transform-origin: left center 0px; transform: rotate(163deg) translate(10px); border-radius: 2px;"></div></div><div style="position: absolute; top: -2px; opacity: 0.25; animation: 1s linear 0s infinite normal none running opacity-45-25-6-11;"><div style="position: absolute; width: 5px; height: 5px; background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 4px; transform-origin: left center 0px; transform: rotate(196deg) translate(10px); border-radius: 2px; top: 2px;"></div><div style="position: absolute; width: 5px; height: 5px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px; transform-origin: left center 0px; transform: rotate(196deg) translate(10px); border-radius: 2px;"></div></div><div style="position: absolute; top: -2px; opacity: 0.25; animation: 1s linear 0s infinite normal none running opacity-45-25-7-11;"><div style="position: absolute; width: 5px; height: 5px; background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 4px; transform-origin: left center 0px; transform: rotate(229deg) translate(10px); border-radius: 2px; top: 2px;"></div><div style="position: absolute; width: 5px; height: 5px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px; transform-origin: left center 0px; transform: rotate(229deg) translate(10px); border-radius: 2px;"></div></div><div style="position: absolute; top: -2px; opacity: 0.25; animation: 1s linear 0s infinite normal none running opacity-45-25-8-11;"><div style="position: absolute; width: 5px; height: 5px; background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 4px; transform-origin: left center 0px; transform: rotate(261deg) translate(10px); border-radius: 2px; top: 2px;"></div><div style="position: absolute; width: 5px; height: 5px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px; transform-origin: left center 0px; transform: rotate(261deg) translate(10px); border-radius: 2px;"></div></div><div style="position: absolute; top: -2px; opacity: 0.25; animation: 1s linear 0s infinite normal none running opacity-45-25-9-11;"><div style="position: absolute; width: 5px; height: 5px; background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 4px; transform-origin: left center 0px; transform: rotate(294deg) translate(10px); border-radius: 2px; top: 2px;"></div><div style="position: absolute; width: 5px; height: 5px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px; transform-origin: left center 0px; transform: rotate(294deg) translate(10px); border-radius: 2px;"></div></div><div style="position: absolute; top: -2px; opacity: 0.25; animation: 1s linear 0s infinite normal none running opacity-45-25-10-11;"><div style="position: absolute; width: 5px; height: 5px; background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 4px; transform-origin: left center 0px; transform: rotate(327deg) translate(10px); border-radius: 2px; top: 2px;"></div><div style="position: absolute; width: 5px; height: 5px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px; transform-origin: left center 0px; transform: rotate(327deg) translate(10px); border-radius: 2px;"></div></div></div></span>
        `,
        STATES: {
            START : 'start',
            LOAD : 'load',
            SUCCESS : 'success',
            FAIL : 'FAIL'
          },
          URLS: {
            MAIN : 'https://api.godialog.ru/api/v1/333/',
            PHOTO : 'images/upload/true/'
          },
        ANIMATIONS: {
          PRELOADER : `
          <div class="preloader plugin animation" style="width:44px;height:44px;">
          <span class="preloader-inner">
            <span class="preloader-inner-line"></span>
            <span class="preloader-inner-line"></span>
            <span class="preloader-inner-line"></span>
            <span class="preloader-inner-line"></span>
            <span class="preloader-inner-line"></span>
            <span class="preloader-inner-line"></span>
            <span class="preloader-inner-line"></span>
            <span class="preloader-inner-line"></span>
            <span class="preloader-inner-line"></span>
            <span class="preloader-inner-line"></span>
            <span class="preloader-inner-line"></span>
            <span class="preloader-inner-line"></span>
          </span>
        </div>
          `,
          LOADING: this.animateLoading
        },
        requestsOnTypes: {
           'IMAGES' : 'https://api.godialog.ru/api/v1/333/images/upload/true/?source='
        },
        // Default options
        // ===============

        getDefaultOptions: function() {
            return {

                // User
                profilePictureURL: '',
                currentUserIsAdmin: false,
                currentUserId: null,

                // Font awesome icon overrides
                spinnerIconURL: '',
                upvoteIconURL: '',
                replyIconURL: '',
                uploadIconURL: '',
                attachmentIconURL: '',
                fileIconURL: '',
                noCommentsIconURL: '',

                // Strings to be formatted (for example localization)
                textareaPlaceholderText: 'Добавить свой...',//'Add a comment',
                newestText: 'Newest',
                oldestText: 'Oldest',
                popularText: 'Popular',
                attachmentsText: 'Attachments',
                sendText: 'Send',
                replyText: 'Reply',
                editText: 'Edit',
                editedText: 'Edited',
                youText: 'You',
                saveText: 'Save',
                deleteText: 'Delete',
                newText: 'New',
                viewAllRepliesText: 'View all __replyCount__ replies',
                hideRepliesText: 'Hide replies',
                noCommentsText: 'No comments',
                noAttachmentsText: 'No attachments',
                attachmentDropText: 'Drop files here',
                textFormatter: function(text) {return text},

                // Functionalities
                enableReplying: true,
                enableEditing: true,
                enableUpvoting: true,
                enableDeleting: true,
                enableAttachments: false,
                enableHashtags: false,
                enablePinging: false,
                enableDeletingCommentWithReplies: false,
                enableNavigation: true,
                postCommentOnEnter: false,
                forceResponsive: false,
                readOnly: false,
                defaultNavigationSortKey: 'newest',

                // Colors
                highlightColor: '#2793e6',
                deleteButtonColor: '#C9302C',

                scrollContainer: this.$el,
                roundProfilePictures: false,
                textareaRows: 1,
                textareaRowsOnFocus: 1,
                textareaMaxRows: 7,
                maxRepliesVisible: 2,

                fieldMappings: {
                    id: 'id',
                    parent: 'parent',
                    created: 'created',
                    modified: 'modified',
                    content: 'content',
                    file: 'file',
                    fileURL: 'file_url',
                    fileMimeType: 'file_mime_type',
                    pings: 'pings',
                    creator: 'creator',
                    fullname: 'fullname',
                    profileURL: 'profile_url',
                    profilePictureURL: 'profile_picture_url',
                    isNew: 'is_new',
                    createdByAdmin: 'created_by_admin',
                    createdByCurrentUser: 'created_by_current_user',
                    upvoteCount: 'upvote_count',
                    userHasUpvoted: 'user_has_upvoted'
                },

                searchUsers: function(term, success, error) {success([])},
                getComments: function(success, error) {success([])},
                postComment: function(commentJSON, success, error) {success(commentJSON)},
                putComment: function(commentJSON, success, error) {success(commentJSON)},
                deleteComment: function(commentJSON, success, error) {success()},
                upvoteComment: function(commentJSON, success, error) {success(commentJSON)},
                hashtagClicked: function(hashtag) {},
                pingClicked: function(userId) {},
                uploadAttachments: function(commentArray, success, error) {success(commentArray)},
                refresh: function() {},
                timeFormatter: function(time) {return new Date(time).toLocaleDateString()}
            }
        },


        // Initialization
        // ==============

        init: function(options, el) {
            this.$el = $(el);
            this.$el.addClass('go-comments');
            this.undelegateEvents();
            this.delegateEvents();

            // Detect mobile devices
            (function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);
            if($.browser.mobile) this.$el.addClass('mobile');

            // Init options
            this.options = $.extend(true, {}, this.getDefaultOptions(), options);;

            // Read-only mode
            if(this.options.readOnly) this.$el.addClass('read-only');

            // Set initial sort key
            this.currentSortKey = this.options.defaultNavigationSortKey;

            // Create CSS declarations for highlight color
            this.createCssDeclarations();

            // Fetching data and rendering
            this.fetchDataAndRender();
        },

        delegateEvents: function() {
            this.bindEvents(false);
        },

        undelegateEvents: function() {
            this.bindEvents(true);
        },

        bindEvents: function(unbind) {
            var bindFunction = unbind ? 'off' : 'on';
            for (var key in this.events) {
                var eventName = key.split(' ')[0];
                var selector = key.split(' ').slice(1).join(' ');
                var methodNames = this.events[key].split(' ');

                for(var index in methodNames) {
                    if(methodNames.hasOwnProperty(index)) {
                        var method = this[methodNames[index]];

                        // Keep the context
                        method = $.proxy(method, this);

                        if (selector == '') {
                            this.$el[bindFunction](eventName, method);
                        } else {
                            this.$el[bindFunction](eventName, selector, method);
                        }
                    }
                }
            }
        },


        // Basic functionalities
        // =====================

        fetchDataAndRender: function () {
            var self = this;
            this.commentsById = {};

            this.$el.empty();
            this.createHTML();

            // Comments
            // ========

            this.options.getComments(function(commentsArray) {

                // Convert comments to custom data model
                var commentModels = commentsArray.map(function(commentsJSON){
                    return self.createCommentModel(commentsJSON)
                });

                // Sort comments by date (oldest first so that they can be appended to the data model
                // without caring dependencies)
                self.sortComments(commentModels, 'oldest');

                $(commentModels).each(function(index, commentModel) {
                    self.addCommentToDataModel(commentModel);
                });

                // Mark data as fetched
                self.dataFetched = true;

                // Render
                self.render();
            });
        },

        fetchNext: function() {
            var self = this;

            // Loading indicator
            var spinner = this.createSpinner();
            this.$el.find('ul#comment-list').append(spinner);

            var success = function (commentModels) {
                $(commentModels).each(function(index, commentModel) {
                    self.createComment(commentModel);
                });
                spinner.remove();
            }

            var error = function() {
                spinner.remove();
            }

            this.options.getComments(success, error);
        },

        createCommentModel: function(commentJSON) {
            var commentModel = this.applyInternalMappings(commentJSON);
            commentModel.childs = [];
            return commentModel;
        },

        addCommentToDataModel: function(commentModel) {
            if(!(commentModel.id in this.commentsById)) {
                this.commentsById[commentModel.id] = commentModel;

                // Update child array of the parent (append childs to the array of outer most parent)
                if(commentModel.parent) {
                    var outermostParent = this.getOutermostParent(commentModel.parent);
                    outermostParent.childs.push(commentModel.id);
                }
            }
        },

        updateCommentModel: function(commentModel) {
            $.extend(this.commentsById[commentModel.id], commentModel);
        },

        render: function() {
            var self = this;

            // Prevent re-rendering if data hasn't been fetched
            if(!this.dataFetched) return;

            // Show active container
            this.showActiveContainer();

            // Create comments
            this.createComments();

            // Create attachments if enabled
            if(this.options.enableAttachments) this.createAttachments();

            // Remove spinner
            this.$el.find('> .spinner').remove();

            this.options.refresh();
        },

        showActiveContainer: function() {
            var activeNavigationEl = this.$el.find('.navigation li[data-container-name].active');
            var containerName = activeNavigationEl.data('container-name');
            var containerEl = this.$el.find('[data-container="' + containerName + '"]');
            containerEl.siblings('[data-container]').hide();
            containerEl.show();
        },

        createComments: function() {
            var self = this;

            // Create the list element before appending to DOM in order to reach better performance
            this.$el.find('#comment-list').remove();
            var commentList = $('<ul/>', {
                id: 'comment-list',
                'class': 'main'
            });

            // Divide commments into main level comments and replies
            var mainLevelComments = [];
            var replies = [];
            $(this.getComments()).each(function(index, commentModel) {
                if(commentModel.parent == null) {
                    mainLevelComments.push(commentModel);
                } else {
                    replies.push(commentModel);
                }
            });

            // Append main level comments
            this.sortComments(mainLevelComments, this.currentSortKey);
            mainLevelComments.reverse();    // Reverse the order as they are prepended to DOM
            $(mainLevelComments).each(function(index, commentModel) {
                self.addComment(commentModel, commentList);
            });

            // Append replies in chronological order
            this.sortComments(replies, 'oldest');
            $(replies).each(function(index, commentModel) {
                self.addComment(commentModel, commentList);
            });

            // Appned list to DOM
            this.$el.find('[data-container="comments"]').prepend(commentList);
        },

        createAttachments: function() {
            var self = this;

            // Create the list element before appending to DOM in order to reach better performance
            this.$el.find('#attachment-list').remove();
            var attachmentList = $('<ul/>', {
                id: 'attachment-list',
                'class': 'main'
            });

            var attachments = this.getAttachments();
            this.sortComments(attachments, 'newest');
            attachments.reverse();    // Reverse the order as they are prepended to DOM
            $(attachments).each(function(index, commentModel) {
                self.addAttachment(commentModel, attachmentList);
            });

            // Appned list to DOM
            this.$el.find('[data-container="attachments"]').prepend(attachmentList);
        },

        addComment: function(commentModel, commentList) {
            commentList = commentList || this.$el.find('#comment-list');
            var commentEl = this.createCommentElement(commentModel);

            // Case: reply
            if(commentModel.parent) {
                var directParentEl = commentList.find('.comment[data-id="'+commentModel.parent+'"]');

                // Re-render action bar of direct parent element
                this.reRenderCommentActionBar(commentModel.parent);

                // Force replies into one level only
                var outerMostParent = directParentEl.parents('.comment').last();
                if(outerMostParent.length == 0) outerMostParent = directParentEl;

                // Append element to DOM
                var childCommentsEl = outerMostParent.find('.child-comments');
                var commentingField = childCommentsEl.find('.commenting-field');
                if(commentingField.length) {
                    commentingField.before(commentEl)
                } else {
                    childCommentsEl.append(commentEl);
                }

                // Update toggle all -button
                this.updateToggleAllButton(outerMostParent);

            // Case: main level comment
            } else {
                if(this.currentSortKey == 'newest') {
                    commentList.prepend(commentEl);
                } else {
                    commentList.append(commentEl);
                }
            }
        },

        addAttachment: function(commentModel, commentList) {
            commentList = commentList || this.$el.find('#attachment-list');
            var commentEl = this.createCommentElement(commentModel);
            commentList.prepend(commentEl);
        },

        removeComment: function(commentId) {
            var self = this;
            var commentModel = this.commentsById[commentId];

            // Remove child comments recursively
            var childComments = this.getChildComments(commentModel.id);
            $(childComments).each(function(index, childComment) {
                self.removeComment(childComment.id);
            });

            // Update the child array of outermost parent
            if(commentModel.parent) {
                var outermostParent = this.getOutermostParent(commentModel.parent);
                var indexToRemove = outermostParent.childs.indexOf(commentModel.id);
                outermostParent.childs.splice(indexToRemove, 1);
            }

            // Remove the comment from data model
            delete this.commentsById[commentId];

            var commentElements = this.$el.find('li.comment[data-id="'+commentId+'"]');
            var parentEl = commentElements.parents('li.comment').last();
            
           



            // Remove the element
            commentElements.remove();

            // Update the toggle all button
            this.updateToggleAllButton(parentEl);
        },

        uploadAttachments: function(files, commentingField) {
           
            var self = this;
            if(!commentingField) commentingField = this.$el.find('.commenting-field.main');
            var uploadButton = commentingField.find('.upload');
            var isReply = !commentingField.hasClass('main');

            var fileCount = files.length;

            if(fileCount) {
                var textarea = commentingField.find('.textarea');

                // Disable upload button and append spinners while request is pending
                uploadButton.removeClass('enabled');
                var attachmentListSpinner = this.createSpinner();
                var commentListSpinner = this.createSpinner();
                this.$el.find('ul#attachment-list').prepend(attachmentListSpinner);
                if(isReply) {
                    commentingField.before(commentListSpinner);
                } else {
                    this.$el.find('ul#comment-list').prepend(commentListSpinner);
                }

                var success = function(commentArray) {
                    // добавление файлов к комментариям
                    $(commentArray).each(function(index, commentJSON) {
                        var commentModel = self.createCommentModel(commentJSON);
                        self.addCommentToDataModel(commentModel);
                        self.addComment(commentModel);
                        self.addAttachment(commentModel);
                    });

                    // Close the commenting field if all the uploads were successfull
                    // and there's no content besides the attachment
                    if(commentArray.length == fileCount && self.getTextareaContent(textarea).length == 0) {
                        commentingField.find('.close').trigger('click');
                    }

                    // Enable upload button and remove spinners
                    uploadButton.addClass('enabled');
                    commentListSpinner.remove();
                    attachmentListSpinner.remove();
                };

                var error = function() {
                    // Enable upload button and remove spinners
                    uploadButton.addClass('enabled');
                    commentListSpinner.remove();
                    attachmentListSpinner.remove();
                };

                var commentArray = [];
                $(files).each(function(index, file) {
                    console.log(file);
                    // Create comment JSON
                    var commentJSON = self.createCommentJSON(textarea);
                    commentJSON.id += '-' + index;
                    commentJSON.content = '';
                    commentJSON.file = file;
                    commentJSON.fileURL = 'C:/fakepath/' + file.name;
                    commentJSON.fileMimeType = file.type;

                    // Reverse mapping
                    commentJSON = self.applyExternalMappings(commentJSON);
                    commentArray.push(commentJSON);
                });

                self.options.uploadAttachments(commentArray, success, error);
            }

            // Clear the input field
            uploadButton.find('input').val('');
        },

        updateToggleAllButton: function(parentEl) {
            // Don't hide replies if maxRepliesVisible is null or undefined
            if (this.options.maxRepliesVisible == null) return;

            var childCommentsEl = parentEl.find('.child-comments');
            var childComments = childCommentsEl.find('.comment').not('.hidden');
            var toggleAllButton = childCommentsEl.find('li.toggle-all');
            childComments.removeClass('togglable-reply');

            // Select replies to be hidden
            if (this.options.maxRepliesVisible === 0) {
                var togglableReplies = childComments;
            } else {
                var togglableReplies = childComments.slice(0, -this.options.maxRepliesVisible);
            }

            // Add identifying class for hidden replies so they can be toggled
            togglableReplies.addClass('togglable-reply');

            // Show all replies if replies are expanded
            if(toggleAllButton.find('span.text').text() == this.options.textFormatter(this.options.hideRepliesText)) {
                togglableReplies.addClass('visible');
            }

            // Make sure that toggle all button is present
            if(childComments.length > this.options.maxRepliesVisible) {

                // Append button to toggle all replies if necessary
                if(!toggleAllButton.length) {

                    toggleAllButton = $('<li/>', {
                        'class': 'toggle-all highlight-font-bold'
                    });
                    var toggleAllButtonText = $('<span/>', {
                        'class': 'text'
                    });
                    var caret = $('<span/>', {
                        'class': 'caret'
                    });

                    // Append toggle button to DOM
                    toggleAllButton.append(toggleAllButtonText).append(caret);
                    childCommentsEl.prepend(toggleAllButton);
                }

                // Update the text of toggle all -button
                this.setToggleAllButtonText(toggleAllButton, false);

            // Make sure that toggle all button is not present
            } else {
                toggleAllButton.remove();
            }
        },

        updateToggleAllButtons: function() {
            var self = this;
            var commentList = this.$el.find('#comment-list');

            // Fold comments, find first level children and update toggle buttons
            commentList.find('.comment').removeClass('visible');
            commentList.children('.comment').each(function(index, el) {
                self.updateToggleAllButton($(el));
            });
        },

        sortComments: function (comments, sortKey) {
            var self = this;

            // Sort by popularity
            if(sortKey == 'popularity') {
                comments.sort(function(commentA, commentB) {
                    var pointsOfA = commentA.childs.length;
                    var pointsOfB = commentB.childs.length;

                    if(self.options.enableUpvoting) {
                        pointsOfA += commentA.upvoteCount;
                        pointsOfB += commentB.upvoteCount;
                    }

                    if(pointsOfB != pointsOfA) {
                        return pointsOfB - pointsOfA;

                    } else {
                        // Return newer if popularity is the same
                        var createdA = new Date(commentA.created).getTime();
                        var createdB = new Date(commentB.created).getTime();
                        return createdB - createdA;
                    }
                });

            // Sort by date
            } else {
                comments.sort(function(commentA, commentB) {
                    var createdA = new Date(commentA.created).getTime();
                    var createdB = new Date(commentB.created).getTime();
                    if(sortKey == 'oldest') {
                        return createdA - createdB;
                    } else {
                        return createdB - createdA;
                    }
                });
            }
        },

        sortAndReArrangeComments: function(sortKey) {
            var commentList = this.$el.find('#comment-list');

            // Get main level comments
            var mainLevelComments = this.getComments().filter(function(commentModel){return !commentModel.parent});
            this.sortComments(mainLevelComments, sortKey);

            // Rearrange the main level comments
            $(mainLevelComments).each(function(index, commentModel) {
                var commentEl = commentList.find('> li.comment[data-id='+commentModel.id+']');
                commentList.append(commentEl);
            });
        },

        showActiveSort: function() {
            var activeElements = this.$el.find('.navigation li[data-sort-key="' + this.currentSortKey + '"]');

            // Indicate active sort
            this.$el.find('.navigation li').removeClass('active');
            activeElements.addClass('active');

            // Update title for dropdown
            var titleEl = this.$el.find('.navigation .title');
            if(this.currentSortKey != 'attachments') {
                titleEl.addClass('active');
                titleEl.find('header').html(activeElements.first().html());
             } else {
                var defaultDropdownEl = this.$el.find('.navigation ul.dropdown').children().first();
                titleEl.find('header').html(defaultDropdownEl.html());
             }

            // Show active container
            this.showActiveContainer();
        },

        forceResponsive: function() {
            this.$el.addClass('responsive');
        },

        // Event handlers
        // ==============

        closeDropdowns: function() {
            this.$el.find('.dropdown').hide();
        },

        saveOnKeydown: function(ev) {
            // Save comment on cmd/ctrl + enter
            if(ev.keyCode == 13) {
                var metaKey = ev.metaKey || ev.ctrlKey;
                if(this.options.postCommentOnEnter || metaKey) {
                    var el = $(ev.currentTarget);
                    el.siblings('.control-row').find('.save').trigger('click');
                    ev.stopPropagation();
                    ev.preventDefault();
                }
            }
        },

        saveEditableContent: function(ev) {
            var el = $(ev.currentTarget);
            el.data('before', el.html());
        },

        checkEditableContentForChange: function(ev) {
            var el = $(ev.currentTarget);

            // Fix jquery-textcomplete on IE, empty text nodes will break up the autocomplete feature
            $(el[0].childNodes).each(function() {
                if(this.nodeType == Node.TEXT_NODE && this.length == 0 && this.removeNode) this.removeNode();
            });

            if (el.data('before') != el.html()) {
                el.data('before', el.html());
                el.trigger('change');
            }
        },

        navigationElementClicked: function(ev) {
            var navigationEl = $(ev.currentTarget);
            var sortKey = navigationEl.data().sortKey;

            // Sort the comments if necessary
            if(sortKey != 'attachments') {
                this.sortAndReArrangeComments(sortKey);
            }

            // Save the current sort key
            this.currentSortKey = sortKey;
            this.showActiveSort();
        },

        toggleNavigationDropdown: function(ev) {
            // Prevent closing immediately
            ev.stopPropagation();

            var dropdown = $(ev.currentTarget).find('~ .dropdown');
            dropdown.toggle();
        },

        showMainCommentingField: function(ev) {
            var mainTextarea = $(ev.currentTarget);
            mainTextarea.siblings('.control-row').show();
            mainTextarea.parent().find('.close').show();
            mainTextarea.parent().find('.upload.inline-button').hide();
            mainTextarea.focus();
        },

        hideMainCommentingField: function(ev) {
            var closeButton = $(ev.currentTarget);
            var mainTextarea = this.$el.find('.commenting-field.main .textarea');
            var mainControlRow = this.$el.find('.commenting-field.main .control-row');

            this.clearTextarea(mainTextarea);
            this.adjustTextareaHeight(mainTextarea, false);

            mainControlRow.hide();
            closeButton.hide();
            mainTextarea.parent().find('.upload.inline-button').show();
            mainTextarea.blur();
        },

        increaseTextareaHeight: function(ev) {
            var textarea = $(ev.currentTarget);
            this.adjustTextareaHeight(textarea, true);
        },

        textareaContentChanged: function(ev) {
            var textarea = $(ev.currentTarget);
            var saveButton = textarea.siblings('.control-row').find('.save');

            // Update parent id if reply-to tag was removed
            if(!textarea.find('.reply-to.tag').length) {
                var commentId = textarea.attr('data-comment');

                // Case: editing comment
                if(commentId) {
                    var parentComments = textarea.parents('li.comment');
                    if(parentComments.length > 1) {
                        var parentId = parentComments.last().data('id');
                        textarea.attr('data-parent', parentId);
                    }

                // Case: new comment
                } else {
                    var parentId = textarea.parents('li.comment').last().data('id');
                    textarea.attr('data-parent', parentId);
                }
            }

            // Move close button if scrollbar is visible
            var commentingField = textarea.parents('.commenting-field').first();
            if(textarea[0].scrollHeight > textarea.outerHeight()) {
                commentingField.addClass('commenting-field-scrollable');
            } else {
                commentingField.removeClass('commenting-field-scrollable');
            }

            // Check if content or parent has changed if editing
            var contentOrParentChangedIfEditing = true;
            var content = this.getTextareaContent(textarea, true);
            if(commentModel = this.commentsById[textarea.attr('data-comment')]) {
                var contentChanged = content != commentModel.content;
                var parentFromModel;
                if(commentModel.parent) {
                    parentFromModel = commentModel.parent.toString();
                }
                var parentChanged = textarea.attr('data-parent') != parentFromModel;
                contentOrParentChangedIfEditing = contentChanged || parentChanged;
            }

            // Check whether save button needs to be enabled
            if(content.length && contentOrParentChangedIfEditing) {
                saveButton.addClass('enabled');
            } else {
                saveButton.removeClass('enabled');
            }
        },

        removeCommentingField: function(ev) {
            var closeButton = $(ev.currentTarget);

            // Remove edit class from comment if user was editing the comment
            var textarea = closeButton.siblings('.textarea');
            if(textarea.attr('data-comment')) {
                closeButton.parents('li.comment').first().removeClass('edit');
            }

            // Remove the field
            var commentingField = closeButton.parents('.commenting-field').first();


            // #change : remove files(commenting-field.data-time)
               delete this.filesInCommentingField[commentingField.data('time')];               
            // #change
            commentingField.remove();
        },

        postComment: function(ev) {
            var self = this;
            var sendButton = $(ev.currentTarget);
            var commentingField = sendButton.parents('.commenting-field').first();
            var textarea = commentingField.find('.textarea');

            // Disable send button while request is pending
            sendButton.removeClass('enabled');

            // Create comment JSON
            var commentJSON = this.createCommentJSON(textarea);

            // Reverse mapping
            commentJSON = this.applyExternalMappings(commentJSON);

            var success = function(commentJSON) {
                self.createComment(commentJSON);
                commentingField.find('.close').trigger('click');
            };

            var error = function() {
                sendButton.addClass('enabled');
            };

            this.options.postComment(commentJSON, success, error);
        },

        createComment: function(commentJSON) {
            var commentModel = this.createCommentModel(commentJSON);
            this.addCommentToDataModel(commentModel);
            this.addComment(commentModel);
        },

        putComment: function(ev) {
            var self = this;
            var saveButton = $(ev.currentTarget);
            var commentingField = saveButton.parents('.commenting-field').first();
            var textarea = commentingField.find('.textarea');

            // Disable send button while request is pending
            saveButton.removeClass('enabled');

            // Use a clone of the existing model and update the model after succesfull update
            var commentJSON =  $.extend({}, this.commentsById[textarea.attr('data-comment')]);
            $.extend(commentJSON, {
                parent: textarea.attr('data-parent') || null,
                content: this.getTextareaContent(textarea),
                pings: this.getPings(textarea),
                modified: new Date().getTime()
            });

            // Reverse mapping
            commentJSON = this.applyExternalMappings(commentJSON);

            var success = function(commentJSON) {
                // The outermost parent can not be changed by editing the comment so the childs array
                // of parent does not require an update

                var commentModel = self.createCommentModel(commentJSON);

                // Delete childs array from new comment model since it doesn't need an update
                delete commentModel['childs'];
                self.updateCommentModel(commentModel);

                // Close the editing field
                commentingField.find('.close').trigger('click');

                // Re-render the comment
                self.reRenderComment(commentModel.id);
            };

            var error = function() {
                saveButton.addClass('enabled');
            };

            this.options.putComment(commentJSON, success, error);
        },

        deleteComment: function(ev) {
            var self = this;
            var deleteButton = $(ev.currentTarget);
            var commentEl = deleteButton.parents('.comment').first();
            var commentJSON =  $.extend({}, this.commentsById[commentEl.attr('data-id')]);
            var commentId = commentJSON.id;
            var parentId = commentJSON.parent;

            // Disable send button while request is pending
            deleteButton.removeClass('enabled');

            // Reverse mapping
            commentJSON = this.applyExternalMappings(commentJSON);

            var success = function() {
                self.removeComment(commentId);
                if(parentId) self.reRenderCommentActionBar(parentId);
            };

            var error = function() {
                deleteButton.addClass('enabled');
            };

            this.options.deleteComment(commentJSON, success, error);
        },

        hashtagClicked: function(ev) {
            var el = $(ev.currentTarget);
            var value = el.attr('data-value');
            this.options.hashtagClicked(value);
        },

        pingClicked: function(ev) {
            var el = $(ev.currentTarget);
            var value = el.attr('data-value');
            this.options.pingClicked(value);
        },
        // TODO: прицепить этот обработчик ко всем моим полям +
        fileInputChanged: function(ev, files) {
        
            var files = ev.currentTarget.files;
            
            var commentingField = $(ev.currentTarget).parents('.commenting-field').first();
            // #change : prepare files
            let arrayPromises = [];
            $(files).each((index,file)=>{
                this.filesInCommentingField[commentingField.data('time')].push(file);
            })
            $(this.filesInCommentingField[commentingField.data('time')]).each((index, file)=> {
                
                arrayPromises.push(this.processFile(file));
                console.log(file);
            })
            
            // #change
           
            // #change : replace call
            //this.uploadAttachments(files, commentingField);
            // #change
            // #change : show preview
             Promise.all(arrayPromises).then(()=>{
               
                this.showPreviews(this.filesInCommentingField[commentingField.data('time')], commentingField);
                this.saveContent(this.filesInCommentingField[commentingField.data('time')]);
             })
               
            // #change
        },
       
        upvoteComment: function(ev) {
            var self = this;
            var commentEl = $(ev.currentTarget).parents('li.comment').first();
            var commentModel = commentEl.data().model;

            // Check whether user upvoted the comment or revoked the upvote
            var previousUpvoteCount = commentModel.upvoteCount;
            var newUpvoteCount;
            if(commentModel.userHasUpvoted) {
                newUpvoteCount = previousUpvoteCount - 1;
            } else {
                newUpvoteCount = previousUpvoteCount + 1;
            }

            // Show changes immediately
            commentModel.userHasUpvoted = !commentModel.userHasUpvoted;
            commentModel.upvoteCount = newUpvoteCount;
            this.reRenderUpvotes(commentModel.id);

            // Reverse mapping
            var commentJSON = $.extend({}, commentModel);
            commentJSON = this.applyExternalMappings(commentJSON);

            var success = function(commentJSON) {
                var commentModel = self.createCommentModel(commentJSON);
                self.updateCommentModel(commentModel);
                self.reRenderUpvotes(commentModel.id);
            };

            var error = function() {

                // Revert changes
                commentModel.userHasUpvoted = !commentModel.userHasUpvoted;
                commentModel.upvoteCount = previousUpvoteCount;
                self.reRenderUpvotes(commentModel.id);
            };

            this.options.upvoteComment(commentJSON, success, error);
        },

        toggleReplies: function(ev) {
            var el = $(ev.currentTarget);
            el.siblings('.togglable-reply').toggleClass('visible');
            this.setToggleAllButtonText(el, true);
        },

        replyButtonClicked: function(ev) {
            var replyButton = $(ev.currentTarget);
            var outermostParent = replyButton.parents('li.comment').last();
            var parentId = replyButton.parents('.comment').first().data().id;


            // Remove existing field
            var replyField = outermostParent.find('.child-comments > .commenting-field');
            if(replyField.length) replyField.remove();
            var previousParentId = replyField.find('.textarea').attr('data-parent');

            // Create the reply field (do not re-create)
            if(previousParentId != parentId) {
                replyField = this.createCommentingFieldElement(parentId);
                outermostParent.find('.child-comments').append(replyField);

                // Move cursor to end
                var textarea = replyField.find('.textarea');
                this.moveCursorToEnd(textarea)

                // Make sure the reply field will be displayed
                var scrollTop = this.options.scrollContainer.scrollTop();
                var endOfReply = scrollTop + replyField.position().top + replyField.outerHeight();
                var endOfScrollable = scrollTop + this.options.scrollContainer.outerHeight();
                if(endOfReply > endOfScrollable) {
                    var newScrollTop = scrollTop + (endOfReply - endOfScrollable);
                    this.options.scrollContainer.scrollTop(newScrollTop);
                }
            }
        },

        editButtonClicked: function(ev) {
            var editButton = $(ev.currentTarget);
            var commentEl = editButton.parents('li.comment').first();
            var commentModel = commentEl.data().model;
            commentEl.addClass('edit');

            // Create the editing field
            var editField = this.createCommentingFieldElement(commentModel.parent, commentModel.id);
            commentEl.find('.comment-wrapper').first().append(editField);

            // Append original content
            var textarea = editField.find('.textarea');
            textarea.attr('data-comment', commentModel.id);

            // Escaping HTML
            textarea.append(this.getFormattedCommentContent(commentModel, true));

            // Move cursor to end
            this.moveCursorToEnd(textarea);
        },

        showDroppableOverlay: function(ev) {
            if(this.options.enableAttachments) {
                this.$el.find('.droppable-overlay').css('top', this.$el[0].scrollTop);
                this.$el.find('.droppable-overlay').show();
                this.$el.addClass('drag-ongoing');
            }
        },

        handleDragEnter: function(ev) {
            var count = $(ev.currentTarget).data('dnd-count') || 0;
            count++;
            $(ev.currentTarget).data('dnd-count', count);
            $(ev.currentTarget).addClass('drag-over');
        },

        handleDragLeave: function(ev, callback) {
            var count = $(ev.currentTarget).data('dnd-count');
            count--;
            $(ev.currentTarget).data('dnd-count', count);

            if(count == 0) {
                $(ev.currentTarget).removeClass('drag-over');
                if(callback) callback();
            }
        },

        handleDragLeaveForOverlay: function(ev) {
            var self = this;
            this.handleDragLeave(ev, function() {
                self.hideDroppableOverlay();
            });
        },

        handleDragLeaveForDroppable: function(ev) {
            this.handleDragLeave(ev);
        },

        handleDragOverForOverlay: function(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            ev.originalEvent.dataTransfer.dropEffect = 'copy';
        },

        hideDroppableOverlay: function() {
            this.$el.find('.droppable-overlay').hide();
            this.$el.removeClass('drag-ongoing');
        },

        handleDrop: function(ev) {
            ev.preventDefault();

            // Reset DND counts
            $(ev.target).trigger('dragleave');

            // Hide the overlay and upload the files
            this.hideDroppableOverlay();
            this.uploadAttachments(ev.originalEvent.dataTransfer.files);
        },

        stopPropagation: function(ev) {
            ev.stopPropagation();
        },


        // HTML elements
        // =============

        createHTML: function() {
            var self = this;

            // Commenting field
            var mainCommentingField = this.createMainCommentingFieldElement();
           
            this.$el.append(mainCommentingField);

            // Hide control row and close button
            var mainControlRow = mainCommentingField.find('.control-row');
            mainControlRow.hide();
            mainCommentingField.find('.close').hide();

            // Navigation bar
            if (this.options.enableNavigation) {
                this.$el.append(this.createNavigationElement());
                this.showActiveSort();
            }

            // Loading spinner
            var spinner = this.createSpinner();
            this.$el.append(spinner);

            // Comments container
            var commentsContainer = $('<div/>', {
                'class': 'data-container',
                'data-container': 'comments'
            });
            this.$el.append(commentsContainer);

            // "No comments" placeholder
            var noComments = $('<div/>', {
                'class': 'no-comments no-data',
                text: this.options.textFormatter(this.options.noCommentsText)
            });
            var noCommentsIcon = $('<i/>', {
                'class': 'fa fa-comments fa-2x'
            });
            if(this.options.noCommentsIconURL.length) {
                noCommentsIcon.css('background-image', 'url("'+this.options.noCommentsIconURL+'")');
                noCommentsIcon.addClass('image');
            }
            noComments.prepend($('<br/>')).prepend(noCommentsIcon);
            commentsContainer.append(noComments);

            // Attachments
            if(this.options.enableAttachments) {

                // Attachments container
                var attachmentsContainer = $('<div/>', {
                    'class': 'data-container',
                    'data-container': 'attachments'
                });
                this.$el.append(attachmentsContainer);

                // "No attachments" placeholder
                var noAttachments = $('<div/>', {
                    'class': 'no-attachments no-data',
                    text: this.options.textFormatter(this.options.noAttachmentsText)
                });
                var noAttachmentsIcon = $('<i/>', {
                    'class': 'fa fa-paperclip fa-2x'
                });
                if(this.options.attachmentIconURL.length) {
                    noAttachmentsIcon.css('background-image', 'url("'+this.options.attachmentIconURL+'")');
                    noAttachmentsIcon.addClass('image');
                }
                noAttachments.prepend($('<br/>')).prepend(noAttachmentsIcon);
                attachmentsContainer.append(noAttachments);


                // Drag & dropping attachments
                var droppableOverlay = $('<div/>', {
                    'class': 'droppable-overlay'
                });

                var droppableContainer = $('<div/>', {
                    'class': 'droppable-container'
                });

                var droppable = $('<div/>', {
                    'class': 'droppable'
                });

                var uploadIcon = $('<i/>', {
                    'class': 'fa fa-paperclip fa-4x'
                });
                if(this.options.uploadIconURL.length) {
                    uploadIcon.css('background-image', 'url("'+this.options.uploadIconURL+'")');
                    uploadIcon.addClass('image');
                }

                var dropAttachmentText = $('<div/>', {
                    text: this.options.textFormatter(this.options.attachmentDropText)
                });
                droppable.append(uploadIcon);
                droppable.append(dropAttachmentText);

                droppableOverlay.html(droppableContainer.html(droppable)).hide();
                this.$el.append(droppableOverlay);
            }
        },

        createProfilePictureElement: function(src, userId) {
            if(src) {
              var profilePicture = $('<div/>').css({
                  'background-image': 'url(' + src + ')'
                });
            } else {
                var profilePicture = $('<i/>', {
                    'class': 'fa fa-user'
                });
            }
            profilePicture.addClass('profile-picture');
            profilePicture.attr('data-user-id', userId);
            if(this.options.roundProfilePictures) profilePicture.addClass('round');
            return profilePicture;
        },

        createMainCommentingFieldElement: function() {
            return this.createCommentingFieldElement(undefined, undefined, true);
        },

        createCommentingFieldElement: function(parentId, existingCommentId, isMain) {
            var self = this;
            let time = Date.now();
            // Commenting field
            var commentingField = $('<div/>', {
                'class': 'commenting-field',
                'data-time' :  time
            });
            this.filesInCommentingField[time] = [];
            if(isMain) commentingField.addClass('main');

            // Comment was modified, use existing data
            if(existingCommentId) {
                var profilePictureURL = this.commentsById[existingCommentId].profilePictureURL;
                var userId = this.commentsById[existingCommentId].creator;

            // New comment was created
            } else {
                var profilePictureURL = this.options.profilePictureURL;
                var userId = this.options.creator;
            }

            var profilePicture = this.createProfilePictureElement(profilePictureURL, userId);

            // New comment
            var textareaWrapper = $('<div/>', {
                'class': 'textarea-wrapper'
            });

            // Control row
            var controlRow = $('<div/>', {
                'class': 'control-row'
            });

            // Textarea
            var textarea = $('<div/>', {
                'class': 'textarea',
                'data-placeholder': this.options.textFormatter(this.options.textareaPlaceholderText),
                contenteditable: true
            });

            // Setting the initial height for the textarea
            this.adjustTextareaHeight(textarea, false);

            // Close button
            var closeButton = $('<span/>', {
                'class': 'close inline-button'
            }).append($('<span class="left"/>')).append($('<span class="right"/>'));

            // Save button text
            if(existingCommentId) {
                var saveButtonText = this.options.textFormatter(this.options.saveText);

                // Delete button
                var deleteButton = $('<span/>', {
                    'class': 'delete',
                    text: this.options.textFormatter(this.options.deleteText)
                }).css('background-color', this.options.deleteButtonColor);
                controlRow.append(deleteButton);

                // Enable the delete button only if the user is allowed to delete
                if(this.isAllowedToDelete(existingCommentId)) deleteButton.addClass('enabled')

            } else {
                var saveButtonText = this.options.textFormatter(this.options.sendText);

                // Add upload button if attachments are enabled
                if(this.options.enableAttachments) {
                    // добавление input с файлами
                    // добавить здесь менюшку с разными файлами - плагин
                    var uploadButton = $('<span/>', {
                        'class': 'enabled upload'
                    });
                    var uploadIcon = $('<i/>', {
                        'class': 'fa fa-paperclip'
                    });
                    // #change : add button to show sheet modal
                    var closeModal = $('<span/>', {
                        'class' :'enabled close-modal',
                        text: this.options.textFormatter('Show Added Media')
                    })
                    // #change
                    // change : delete fileInput
                    /*
                    var fileInput = $('<input/>', {
                        type: 'file',
                        'data-role': 'none' // Prevent jquery-mobile for adding classes
                    });
                    // Multi file upload might not work with backend as the the file names
                    // may be the same causing duplicates
                    if(!$.browser.mobile) fileInput.attr('multiple', 'multiple');
                         */
                    // #change
                // #change: add new file inputs
                        var fileInput = $('<input/>', {
                            accept: 'image/*',
                            class:'media-photo-input',
                            type: 'file',
                            'data-role': 'none' // Prevent jquery-mobile for adding classes
                        });
                        if(!$.browser.mobile) fileInput.attr('multiple', 'multiple');
                    if(this.options.uploadIconURL.length) {
                        uploadIcon.css('background-image', 'url("'+this.options.uploadIconURL+'")');
                        uploadIcon.addClass('image');
                    }
                    controlRow.append(fileInput);
                    fileInput.hide();
                    // Stackoverflow: https://stackoverflow.com/questions/19107685/safari-input-type-file-accept-video-ignores-mp4-files
                    fileInput = $('<input/>', {
                        accept: 'video/*',
                        class:'media-video-input',
                        type: 'file',
                        'data-role': 'none' // Prevent jquery-mobile for adding classes
                    });
                    if(!$.browser.mobile) fileInput.attr('multiple', 'multiple');
                    controlRow.append(fileInput);
                    fileInput.hide();
                    fileInput = $('<input/>', {
                        class:'media-audio-input',
                        accept:'audio/*',
                        type: 'file',
                        'data-role': 'none' // Prevent jquery-mobile for adding classes
                    });
                    if(!$.browser.mobile) fileInput.attr('multiple', 'multiple');
                    controlRow.append(fileInput);
                    fileInput.hide();

               // #change 
               // #change : delete append(fileInput)
                    uploadButton.append(uploadIcon)//.append(fileInput); // #change

                    // Main upload button
                    controlRow.append(uploadButton.clone());

                    // #change : add closeModal to .control-row
                    /**
                     * @todo это норм добавлять туда кнопку ? controlRow виден <=> textarea активен (фокус)
                     **/  
                    controlRow.append(closeModal.clone());
                    // #change
                    // Inline upload button for main commenting field
                    if(isMain) {
                        textareaWrapper.append(uploadButton.clone().addClass('inline-button'));
                    }
                }
            }

            // Save button
            var saveButtonClass = existingCommentId ? 'update' : 'send';
            var saveButton = $('<span/>', {
                'class': saveButtonClass + ' save highlight-background',
                text: saveButtonText
            });

            // Populate the element
            controlRow.prepend(saveButton);
            textareaWrapper.append(closeButton).append(textarea).append(controlRow);
            commentingField.append(profilePicture).append(textareaWrapper);


            if(parentId) {

                // Set the parent id to the field if necessary
                textarea.attr('data-parent', parentId);

                // Append reply-to tag if necessary
                var parentModel = this.commentsById[parentId];
                if(parentModel.parent) {
                    textarea.html('&nbsp;');    // Needed to set the cursor to correct place

                    // Creating the reply-to tag
                    var replyToName = '@' + parentModel.fullname;
                    var replyToTag = this.createTagElement(replyToName, 'reply-to', parentModel.creator, {
                        'data-user-id': parentModel.creator
                    });
                    textarea.prepend(replyToTag);
                }
            }

            // Pinging users
            if(this.options.enablePinging) {
                textarea.textcomplete([{
                    match: /(^|\s)@([^@]*)$/i,
                    index: 2,
                    search: function (term, callback) {
                        term = self.normalizeSpaces(term);

                        // Return empty array on error
                        var error = function() {
                            callback([]);
                        }

                        self.options.searchUsers(term, callback, error);
                    },
                    template: function(user) {
                        var wrapper = $('<div/>');

                        var profilePictureEl = self.createProfilePictureElement(user.profile_picture_url);

                        var detailsEl = $('<div/>', {
                            'class': 'details',
                        });
                        var nameEl = $('<div/>', {
                            'class': 'name',
                        }).html(user.fullname);

                        var emailEl = $('<div/>', {
                            'class': 'email',
                        }).html(user.email);

                        if (user.email) {
                            detailsEl.append(nameEl).append(emailEl);
                        } else {
                            detailsEl.addClass('no-email')
                            detailsEl.append(nameEl)
                        }

                        wrapper.append(profilePictureEl).append(detailsEl);
                        return wrapper.html();
                    },
                    replace: function (user) {
                        var tag = self.createTagElement('@' + user.fullname, 'ping', user.id, {
                            'data-user-id': user.id
                        });
                        return ' ' + tag[0].outerHTML + ' ';
                    },
                }], {
                    appendTo: '.go-comments',
                    dropdownClassName: 'dropdown autocomplete',
                    maxCount: 5,
                    rightEdgeOffset: 0,
                    debounce: 250
                });


                // OVERIDE TEXTCOMPLETE DROPDOWN POSITIONING

                $.fn.textcomplete.Dropdown.prototype.render = function(zippedData) {
                    var contentsHtml = this._buildContents(zippedData);
                    var unzippedData = $.map(zippedData, function (d) { return d.value; });
                    if (zippedData.length) {
                      var strategy = zippedData[0].strategy;
                      if (strategy.id) {
                        this.$el.attr('data-strategy', strategy.id);
                      } else {
                        this.$el.removeAttr('data-strategy');
                      }
                      this._renderHeader(unzippedData);
                      this._renderFooter(unzippedData);
                      if (contentsHtml) {
                        this._renderContents(contentsHtml);
                        this._fitToBottom();
                        this._fitToRight();
                        this._activateIndexedItem();
                      }
                      this._setScroll();
                    } else if (this.noResultsMessage) {
                      this._renderNoResultsMessage(unzippedData);
                    } else if (this.shown) {
                      this.deactivate();
                    }

                    // CUSTOM CODE
                    // ===========

                    // Adjust vertical position
                    var top = parseInt(this.$el.css('top')) + self.options.scrollContainer.scrollTop();
                    this.$el.css('top', top);

                    // Adjust horizontal position
                    var originalLeft = this.$el.css('left');
                    this.$el.css('left', 0);    // Left must be set to 0 in order to get the real width of the el
                    var maxLeft = self.$el.width() - this.$el.outerWidth();
                    var left = Math.min(maxLeft, parseInt(originalLeft));
                    this.$el.css('left', left);

                    // ===========
                }


                // OVERIDE TEXTCOMPLETE CONTENTEDITABLE SKIPSEARCH FUNCTION WHEN USING ALT + backspace

                $.fn.textcomplete.ContentEditable.prototype._skipSearch = function(clickEvent) {
                    switch (clickEvent.keyCode) {
                        case 9:  // TAB
                        case 13: // ENTER
                        case 16: // SHIFT
                        case 17: // CTRL
                        //case 18: // ALT
                        case 33: // PAGEUP
                        case 34: // PAGEDOWN
                        case 40: // DOWN
                        case 38: // UP
                        case 27: // ESC
                            return true;
                    }
                    if (clickEvent.ctrlKey) switch (clickEvent.keyCode) {
                        case 78: // Ctrl-N
                        case 80: // Ctrl-P
                            return true;
                    }
                }
            }

            return commentingField;
        },

        createNavigationElement: function() {
            var navigationEl = $('<ul/>', {
                'class': 'navigation'
            });
            var navigationWrapper = $('<div/>', {
                'class': 'navigation-wrapper'
            });
            navigationEl.append(navigationWrapper);

            // Newest
            var newest = $('<li/>', {
                text: this.options.textFormatter(this.options.newestText),
                'data-sort-key': 'newest',
                'data-container-name': 'comments'
            });

            // Oldest
            var oldest = $('<li/>', {
                text: this.options.textFormatter(this.options.oldestText),
                'data-sort-key': 'oldest',
                'data-container-name': 'comments'
            });

            // Popular
            var popular = $('<li/>', {
                text: this.options.textFormatter(this.options.popularText),
                'data-sort-key': 'popularity',
                'data-container-name': 'comments'
            });

            // Attachments
            var attachments = $('<li/>', {
                text: this.options.textFormatter(this.options.attachmentsText),
                'data-sort-key': 'attachments',
                'data-container-name': 'attachments'
            });

            // Attachments icon
            var attachmentsIcon = $('<i/>', {
                'class': 'fa fa-paperclip'
            });
            if(this.options.attachmentIconURL.length) {
                attachmentsIcon.css('background-image', 'url("'+this.options.attachmentIconURL+'")');
                attachmentsIcon.addClass('image');
            }
            attachments.prepend(attachmentsIcon);


            // Responsive navigation
            var dropdownNavigationWrapper = $('<div/>', {
                'class': 'navigation-wrapper responsive'
            });
            var dropdownNavigation = $('<ul/>', {
                'class': 'dropdown'
            });
            var dropdownTitle = $('<li/>', {
                'class': 'title'
            });
            var dropdownTitleHeader = $('<header/>');

            dropdownTitle.append(dropdownTitleHeader);
            dropdownNavigationWrapper.append(dropdownTitle);
            dropdownNavigationWrapper.append(dropdownNavigation);
            navigationEl.append(dropdownNavigationWrapper);


            // Populate elements
            navigationWrapper.append(newest).append(oldest);
            dropdownNavigation.append(newest.clone()).append(oldest.clone());

            if(this.options.enableReplying || this.options.enableUpvoting) {
                navigationWrapper.append(popular);
                dropdownNavigation.append(popular.clone());
            }
            if(this.options.enableAttachments) {
                navigationWrapper.append(attachments);
                dropdownNavigationWrapper.append(attachments.clone());
            }

            if(this.options.forceResponsive) this.forceResponsive();
            return navigationEl;
        },

        createSpinner: function() {
            var spinner = $('<div/>', {
                'class': 'spinner'
            });
            var spinnerIcon = $('<i/>', {
                'class': 'fa fa-spinner fa-spin'
            });
            if(this.options.spinnerIconURL.length) {
                spinnerIcon.css('background-image', 'url("'+this.options.spinnerIconURL+'")');
                spinnerIcon.addClass('image');
            }
            spinner.html(spinnerIcon);
            return spinner;
        },

        createCommentElement: function(commentModel) {

            // Comment container element
            var commentEl = $('<li/>', {
                'data-id': commentModel.id,
                'class': 'comment'
            }).data('model', commentModel);

            if(commentModel.createdByCurrentUser) commentEl.addClass('by-current-user');
            if(commentModel.createdByAdmin) commentEl.addClass('by-admin');

            // Child comments
            var childComments = $('<ul/>', {
                'class': 'child-comments'
            });

            // Comment wrapper
            var commentWrapper = this.createCommentWrapperElement(commentModel);

            commentEl.append(commentWrapper);
            if(commentModel.parent == null) commentEl.append(childComments);
            return commentEl;
        },

        createCommentWrapperElement: function(commentModel) {
            var commentWrapper = $('<div/>', {
                'class': 'comment-wrapper'
            });

            // Profile picture
            var profilePicture = this.createProfilePictureElement(commentModel.profilePictureURL, commentModel.creator);

            // Time
            var time = $('<time/>', {
                text: this.options.timeFormatter(commentModel.created),
                'data-original': commentModel.created
            });

            // Name element
            var name = $('<span/>', {
                'data-user-id': commentModel.creator,
                'text': commentModel.createdByCurrentUser ? this.options.textFormatter(this.options.youText) : commentModel.fullname
            });

            if(commentModel.profileURL) {
                name = $('<a/>', {
                    'href': commentModel.profileURL,
                    'html': name
                });
            }

            var nameEl = $('<div/>', {
                'class': 'name',
                'html': name
            });

            // Highlight admin names
            if(commentModel.createdByAdmin) nameEl.addClass('highlight-font-bold');

            // Show reply-to name if parent of parent exists
            if(commentModel.parent) {
                var parent = this.commentsById[commentModel.parent];
                if(parent.parent) {
                    var replyTo = $('<span/>', {
                        'class': 'reply-to',
                        'text': parent.fullname,
                        'data-user-id': parent.creator
                    });

                    // reply icon
                    var replyIcon = $('<i/>', {
                        'class': 'fa fa-share'
                    });
                    if(this.options.replyIconURL.length) {
                        replyIcon.css('background-image', 'url("'+this.options.replyIconURL+'")');
                        replyIcon.addClass('image');
                    }

                    replyTo.prepend(replyIcon);
                    nameEl.append(replyTo);
                }
            }

            // New tag
            if(commentModel.isNew) {
                var newTag = $('<span/>', {
                    'class': 'new highlight-background',
                    text: this.options.textFormatter(this.options.newText)
                });
                nameEl.append(newTag);
            }

            // Wrapper
            var wrapper = $('<div/>', {
                'class': 'wrapper'
            });

            // Content
            var content = $('<div/>', {
                'class': 'content'
            });

            // Case: attachment
            // обработка attachments
            var isAttachment = commentModel.fileURL != undefined;
            if(isAttachment) {
                var format = null;
                var type = null;

                // Type and format
                if(commentModel.fileMimeType) {
                    var mimeTypeParts = commentModel.fileMimeType.split('/');
                    if(mimeTypeParts.length == 2) {
                        format = mimeTypeParts[1];
                        type = mimeTypeParts[0];
                    }
                }

                // Attachment link
                var link = $('<a/>', {
                    'class': 'attachment',
                    href: commentModel.fileURL,
                    target: '_blank'
                });

                // Case: image preview
                if(type == 'image') {
                    var image = $('<img/>', {
                        src: commentModel.fileURL
                    });
                    link.html(image);

                // Case: video preview
                } else if(type == 'video') {
                    var video = $('<video/>', {
                        src: commentModel.fileURL,
                        type: commentModel.fileMimeType,
                        controls: 'controls'
                    });
                    link.html(video);

                // Case: icon and text
                } else {

                    // Icon
                    var availableIcons = ['archive', 'audio', 'code', 'excel', 'image', 'movie', 'pdf', 'photo',
                        'picture', 'powerpoint', 'sound', 'video', 'word', 'zip'];

                    var iconClass = 'fa fa-file-o';
                    if(availableIcons.indexOf(format) > 0) {
                        iconClass = 'fa fa-file-' + format + '-o';
                    } else if(availableIcons.indexOf(type) > 0) {
                        iconClass = 'fa fa-file-' + type + '-o';
                    }

                    var fileIcon = $('<i/>', {
                        'class': iconClass
                    });
                    if(this.options.fileIconURL.length) {
                        fileIcon.css('background-image', 'url("'+this.options.fileIconURL+'")');
                        fileIcon.addClass('image');
                    }

                    // File name
                    var parts = commentModel.fileURL.split('/');
                    var fileName = parts[parts.length - 1];
                    fileName = fileName.split('?')[0];
                    fileName = decodeURIComponent(fileName);

                    link.text(fileName);
                    link.prepend(fileIcon);
                }
                content.html(link);

            // Case: regular comment
            } else {
                content.html(this.getFormattedCommentContent(commentModel));
            }

            // Edited timestamp
            if(commentModel.modified && commentModel.modified != commentModel.created) {
                var editedTime = this.options.timeFormatter(commentModel.modified);
                var edited = $('<time/>', {
                    'class': 'edited',
                    text: this.options.textFormatter(this.options.editedText) + ' ' + editedTime,
                    'data-original': commentModel.modified
                });
                content.append(edited);
            }

            // Actions
            var actions = $('<span/>', {
                'class': 'actions'
            });

            // Separator
            var separator = $('<span/>', {
                'class': 'separator',
                text: '·'
            });

            // Reply
            var reply = $('<button/>', {
                'class': 'action reply',
                'type': 'button',
                text: this.options.textFormatter(this.options.replyText)
            });

            // Upvote icon
            var upvoteIcon = $('<i/>', {
                'class': 'fa fa-thumbs-up'
            });
            if(this.options.upvoteIconURL.length) {
                upvoteIcon.css('background-image', 'url("'+this.options.upvoteIconURL+'")');
                upvoteIcon.addClass('image');
            }

            // Upvotes
            var upvotes = this.createUpvoteElement(commentModel);

            // Append buttons for actions that are enabled
            if(this.options.enableReplying) actions.append(reply);
            if(this.options.enableUpvoting) actions.append(upvotes);

            if(commentModel.createdByCurrentUser || this.options.currentUserIsAdmin) {

                // Case: delete button for attachment
                if(isAttachment && this.isAllowedToDelete(commentModel.id)) {
                    var deleteButton = $('<button/>', {
                        'class': 'action delete enabled',
                        text: this.options.textFormatter(this.options.deleteText)
                    });
                    actions.append(deleteButton);

                // Case: edit button for regular comment
                } else if(!isAttachment && this.options.enableEditing) {
                    var editButton = $('<button/>', {
                        'class': 'action edit',
                        text: this.options.textFormatter(this.options.editText)
                    });
                    actions.append(editButton);
                }
            }

            // Append separators between the actions
            actions.children().each(function(index, actionEl) {
                if(!$(actionEl).is(':last-child')) {
                    $(actionEl).after(separator.clone());
                }
            });

            wrapper.append(content);
            wrapper.append(actions);
            commentWrapper.append(profilePicture).append(time).append(nameEl).append(wrapper);
            return commentWrapper;
        },

        createUpvoteElement: function(commentModel) {
            // Upvote icon
            var upvoteIcon = $('<i/>', {
                'class': 'fa fa-thumbs-up'
            });
            if(this.options.upvoteIconURL.length) {
                upvoteIcon.css('background-image', 'url("'+this.options.upvoteIconURL+'")');
                upvoteIcon.addClass('image');
            }

            // Upvotes
            var upvoteEl = $('<button/>', {
                'class': 'action upvote' + (commentModel.userHasUpvoted ? ' highlight-font' : '')
            }).append($('<span/>', {
                text: commentModel.upvoteCount,
                'class': 'upvote-count'
            })).append(upvoteIcon);

            return upvoteEl;
        },

        createTagElement: function(text, extraClasses, value, extraAttributes) {
            var tagEl = $('<input/>', {
                'class': 'tag',
                'type': 'button',
                'data-role': 'none',
            });
            if(extraClasses) tagEl.addClass(extraClasses);
            tagEl.val(text);
            tagEl.attr('data-value', value);
            if (extraAttributes) tagEl.attr(extraAttributes);
            return tagEl;
        },

        reRenderComment: function(id) {
            var commentModel = this.commentsById[id];
            var commentElements = this.$el.find('li.comment[data-id="'+commentModel.id+'"]');

            var self = this;
            commentElements.each(function(index, commentEl) {
                var commentWrapper = self.createCommentWrapperElement(commentModel);
                $(commentEl).find('.comment-wrapper').first().replaceWith(commentWrapper);
            });
        },

        reRenderCommentActionBar: function(id) {
            var commentModel = this.commentsById[id];
            var commentElements = this.$el.find('li.comment[data-id="'+commentModel.id+'"]');

            var self = this;
            commentElements.each(function(index, commentEl) {
                var commentWrapper = self.createCommentWrapperElement(commentModel);
                $(commentEl).find('.actions').first().replaceWith(commentWrapper.find('.actions'));
            });
        },

        reRenderUpvotes: function(id) {
            var commentModel = this.commentsById[id];
            var commentElements = this.$el.find('li.comment[data-id="'+commentModel.id+'"]');

            var self = this;
            commentElements.each(function(index, commentEl) {
                var upvotes = self.createUpvoteElement(commentModel);
                $(commentEl).find('.upvote').first().replaceWith(upvotes);
            });
        },


        // Styling
        // =======

        createCssDeclarations: function() {

            // Remove previous css-declarations
            $('head style.go-comments-css').remove();

            // Navigation underline
            this.createCss('.go-comments ul.navigation li.active:after {background: '
                + this.options.highlightColor  + ' !important;',
                +'}');

            // Dropdown active element
            this.createCss('.go-comments ul.navigation ul.dropdown li.active {background: '
                + this.options.highlightColor  + ' !important;',
                +'}');

            // Background highlight
            this.createCss('.go-comments .highlight-background {background: '
                + this.options.highlightColor  + ' !important;',
                +'}');

            // Font highlight
            this.createCss('.go-comments .highlight-font {color: '
                + this.options.highlightColor + ' !important;'
                +'}');
            this.createCss('.go-comments .highlight-font-bold {color: '
                + this.options.highlightColor + ' !important;'
                + 'font-weight: bold;'
                +'}');
        },

        createCss: function(css) {
            var styleEl = $('<style/>', {
                type: 'text/css',
                'class': 'go-comments-css',
                text: css
            });
            $('head').append(styleEl);
        },


        // Utilities
        // =========

        getComments: function() {
            var self = this;
            return Object.keys(this.commentsById).map(function(id){return self.commentsById[id]});
        },

        getChildComments: function(parentId) {
            return this.getComments().filter(function(comment){return comment.parent == parentId});
        },

        getAttachments: function() {
            return this.getComments().filter(function(comment){return comment.fileURL != undefined});
        },

        getOutermostParent: function(directParentId) {
            var parentId = directParentId;
            do {
                var parentComment = this.commentsById[parentId];
                parentId = parentComment.parent;
            } while(parentComment.parent != null);
            return parentComment;
        },

        createCommentJSON: function(textarea) {
            var time = new Date().toISOString();
            var commentJSON = {
                id: 'c' +  (this.getComments().length + 1),   // Temporary id
                parent: textarea.attr('data-parent') || null,
                created: time,
                modified: time,
                content: this.getTextareaContent(textarea),
                pings: this.getPings(textarea),
                fullname: this.options.textFormatter(this.options.youText),
                profilePictureURL: this.options.profilePictureURL,
                createdByCurrentUser: true,
                upvoteCount: 0,
                userHasUpvoted: false
            };
            return commentJSON;
        },

        isAllowedToDelete: function(commentId) {
            if(this.options.enableDeleting) {
                var isAllowedToDelete = true;
                if(!this.options.enableDeletingCommentWithReplies) {
                    $(this.getComments()).each(function(index, comment) {
                        if(comment.parent == commentId) isAllowedToDelete = false;
                    });
                }
                return isAllowedToDelete;
            }
            return false;
        },

        setToggleAllButtonText: function(toggleAllButton, toggle) {
            var self = this;
            var textContainer = toggleAllButton.find('span.text');
            var caret = toggleAllButton.find('.caret');

            var showExpandingText = function() {
                var text = self.options.textFormatter(self.options.viewAllRepliesText);
                var replyCount = toggleAllButton.siblings('.comment').not('.hidden').length;
                text = text.replace('__replyCount__', replyCount);
                textContainer.text(text);
            };

            var hideRepliesText = this.options.textFormatter(this.options.hideRepliesText);

            if(toggle) {

                // Toggle text
                if(textContainer.text() == hideRepliesText) {
                    showExpandingText();
                } else {
                    textContainer.text(hideRepliesText);
                }
                // Toggle direction of the caret
                caret.toggleClass('up');

            } else {

                // Update text if necessary
                if(textContainer.text() != hideRepliesText) {
                    showExpandingText();
                }
            }
        },

        adjustTextareaHeight: function(textarea, focus) {
            var textareaBaseHeight = 2.2;
            var lineHeight = 1.45;

            var setRows = function(rows) {
                var height = textareaBaseHeight + (rows - 1) * lineHeight;
                textarea.css('height', height + 'em');
            };

            textarea = $(textarea);
            var rowCount = focus == true ? this.options.textareaRowsOnFocus : this.options.textareaRows;
            do {
                setRows(rowCount);
                rowCount++;
                var isAreaScrollable = textarea[0].scrollHeight > textarea.outerHeight();
                var maxRowsUsed = this.options.textareaMaxRows == false ?
                    false : rowCount > this.options.textareaMaxRows;
            } while(isAreaScrollable && !maxRowsUsed);
        },

        clearTextarea: function(textarea) {
            textarea.empty().trigger('input');
        },

        getTextareaContent: function(textarea, humanReadable) {
            var textareaClone = textarea.clone();

            // Remove reply-to tag
            textareaClone.find('.reply-to.tag').remove();

            // Replace tags with text values
            textareaClone.find('.tag.hashtag').replaceWith(function(){
                return humanReadable ? $(this).val() : '#' + $(this).attr('data-value');
            });
            textareaClone.find('.tag.ping').replaceWith(function(){
                return humanReadable ? $(this).val() : '@' + $(this).attr('data-value');
            });

            var ce = $('<pre/>').html(textareaClone.html());
            ce.find('div, p, br').replaceWith(function() { return '\n' + this.innerHTML; });

            // Trim leading spaces
            var text = ce.text().replace(/^\s+/g, '');

            // Normalize spaces
            var text = this.normalizeSpaces(text);
            return text;
        },

        getFormattedCommentContent: function(commentModel, replaceNewLines) {
            var html = this.escape(commentModel.content);
            html = this.linkify(html);
            html = this.highlightTags(commentModel, html);
            if(replaceNewLines) html = html.replace(/(?:\n)/g, '<br>');
            return html;
        },

        // Return pings in format
        //  {
        //      id1: userFullname1,
        //      id2: userFullname2,
        //      ...
        //  }
        getPings: function(textarea) {
            var pings = {};
            textarea.find('.ping').each(function(index, el){
                var id = parseInt($(el).attr('data-value'));
                var value = $(el).val();
                pings[id] = value.slice(1);
            });
            return pings;
        },

        moveCursorToEnd: function(el) {
            el = $(el)[0];

            // Trigger input to adjust size
            $(el).trigger('input');

            // Scroll to bottom
            $(el).scrollTop(el.scrollHeight);

            // Move cursor to end
            if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != 'undefined') {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }

            // Focus
            el.focus();
        },

        escape: function(inputText) {
            return $('<pre/>').text(this.normalizeSpaces(inputText)).html();
        },

        normalizeSpaces: function(inputText) {
            return inputText.replace(new RegExp('\u00a0', 'g'), ' ');   // Convert non-breaking spaces to reguar spaces
        },

        after: function(times, func) {
            var self = this;
            return function() {
                times--;
                if (times == 0) {
                    return func.apply(self, arguments);
                }
            }
        },

        highlightTags: function(commentModel, html) {
            if(this.options.enableHashtags) html = this.highlightHashtags(commentModel, html);
            if(this.options.enablePinging) html = this.highlightPings(commentModel, html);
            return html;
        },

        highlightHashtags: function(commentModel, html) {
            var self = this;

            if(html.indexOf('#') != -1) {

                var __createTag = function(tag) {
                    var tag = self.createTagElement('#' + tag, 'hashtag', tag);
                    return tag[0].outerHTML;
                }

                var regex = /(^|\s)#([a-zäöüß\d-_]+)/gim;
                html = html.replace(regex, function($0, $1, $2){
                    return $1 + __createTag($2);
                });
            }
            return html;
        },

        highlightPings: function(commentModel, html) {
            var self = this;

            if(html.indexOf('@') != -1) {

                var __createTag = function(pingText, userId) {
                    var tag = self.createTagElement(pingText, 'ping', userId, {
                        'data-user-id': userId
                    });
                    return tag[0].outerHTML;
                }

                $(Object.keys(commentModel.pings)).each(function(index, userId) {
                    var fullname = commentModel.pings[userId];
                    var pingText = '@' + fullname;
                    html = html.replace(new RegExp(pingText, 'g'), __createTag(pingText, userId));
                });
            }
            return html;
        },

        linkify: function(inputText) {
            var replacedText, replacePattern1, replacePattern2, replacePattern3;

            // URLs starting with http://, https://, ftp:// or file://
            replacePattern1 = /(\b(https?|ftp|file):\/\/[-A-ZÄÖÅ0-9+&@#\/%?=~_|!:,.;]*[-A-ZÄÖÅ0-9+&@#\/%=~_|])/gim;
            replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

            // URLs starting with "www." (without // before it, or it would re-link the ones done above).
            replacePattern2 = /(^|[^\/f])(www\.[-A-ZÄÖÅ0-9+&@#\/%?=~_|!:,.;]*[-A-ZÄÖÅ0-9+&@#\/%=~_|])/gim;
            replacedText = replacedText.replace(replacePattern2, '$1<a href="https://$2" target="_blank">$2</a>');

            // Change email addresses to mailto: links.
            replacePattern3 = /(([A-ZÄÖÅ0-9\-\_\.])+@[A-ZÄÖÅ\_]+?(\.[A-ZÄÖÅ]{2,6})+)/gim;
            replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1" target="_blank">$1</a>');

            // If there are hrefs in the original text, let's split
            // the text up and only work on the parts that don't have urls yet.
            var count = inputText.match(/<a href/g) || [];

            if (count.length > 0) {
                // Keep delimiter when splitting
                var splitInput = inputText.split(/(<\/a>)/g);
                for (var i = 0 ; i < splitInput.length ; i++) {
                    if (splitInput[i].match(/<a href/g) == null) {
                        splitInput[i] = splitInput[i]
                            .replace(replacePattern1, '<a href="$1" target="_blank">$1</a>')
                            .replace(replacePattern2, '$1<a href="https://$2" target="_blank">$2</a>')
                            .replace(replacePattern3, '<a href="mailto:$1" target="_blank">$1</a>');
                    }
                }
                var combinedReplacedText = splitInput.join('');
                return combinedReplacedText;
            } else {
                return replacedText;
            }
        },

        waitUntil: function(condition, callback) {
            var self = this;

            if(condition()) {
                callback();
            } else {
                setTimeout(function() {
                    self.waitUntil(condition, callback);
                }, 100);
            }
        },

        applyInternalMappings: function(commentJSON) {
            // Inverting field mappings
            var invertedMappings = {};
            var mappings = this.options.fieldMappings;
            for (var prop in mappings) {
                if(mappings.hasOwnProperty(prop)) {
                    invertedMappings[mappings[prop]] = prop;
                }
            }

            return this.applyMappings(invertedMappings, commentJSON);
        },

        applyExternalMappings: function(commentJSON) {
            var mappings = this.options.fieldMappings;
            return this.applyMappings(mappings, commentJSON);
        },

        applyMappings: function(mappings, commentJSON) {
            var result = {};

            for(var key1 in commentJSON) {
                if(key1 in mappings) {
                    var key2 = mappings[key1];
                    result[key2] = commentJSON[key1];
                }
            }
            return result;
        },

        // plugin load media
        /**
         * Показывает action modal с кнопками : фото, видео, аудио
         */
        showSheetModal: function() {
            
            let ac = app.actions.create({
                buttons: [
                  {
                    text: 'Photo',
                    onClick: function () {
                      $('.media-photo-input').click();
                    }
                  },
                  {
                    text: 'Video',
                    onClick: function () {
                      $('.media-video-input').click();
                    }
                  },
                  {
                    text: 'Audio',
                    onClick: function () {
                      $('.media-audio-input').click();
                    }
                  },
                  {
                      text: 'Cancel',
                      color:'red',
                      onClick: function () {
                        
                      }
                  }
                ]
              });
              ac.open();
        },
        /**
         * Расширяет file для создания preview и включения в запрос
         * 
         * @param {type File} file - file to process 
         */
        processFile: function(file) {
           let d = $.Deferred();
           file.processType = file.type.split("/")[0];
           let reader = new FileReader();
           switch(file.processType) {
               case 'video' :
                 /** @todo добавить preview для video*/
                 
                 file.preview = {

                 };
                 d.resolve();
                  break;
                case 'image':
                
                  reader.onloadend = (e)=> {
                    file.preview = {
                       url: e.target.result
                    }
                    
                    d.resolve();
                  }
                  reader.readAsDataURL(file); 
                  break;
                case 'audio':
                   file.preview = {
                     text :file.name,
                     placeholder: 'audio'
                   }
                   d.resolve();
                   break;
                
           }
           return d;
        },
        /**
         * Удаляет из массива files элемент с индексом index
         * @param {type integer} index 
         * @param {type array} files 
         */
        removeFile : function(index, files) {
            files.splice(index,1);
        },
        /**
         * Показать добавленные файлы внутри sheet modal
          */
        showDynamicSheetModal : function() {
            if(this.dynamicSheetModal) this.dynamicSheetModal.open();
        },
        /**
         * Создает html-разметку для каждого preview
         * @param {type File} file 
         * @param {type string} mainClass
         * @param {type string} beforeImg - разметка будет различной в разных блоках. Учтем это
         * @param {type string} styleImg
         * @param {type string} classImg
         * @param {type Integer} index - индекс file в массиве files
         * @return {type string} html - разметка
         */
        createPreviewHtml: function(file,mainClass, beforeImg, styleImg, classImg, index) {
            let html = ``;
            switch(file.preview.placeholder) {
                case 'audio' :
                    html = `<div class'${mainClass}'>
                                     <i class='f7-icons'>music_note</i>
                                     <div class='text'>
                                        ${file.preview.text}
                                     </div>
                                 </div>`
                    break;
               default:
                 
                 html = `
                        <div class="${mainClass}" data-index="${index}">
                          ${beforeImg}
                          
                           <img style="${styleImg}" class="${classImg}" src="${file.preview.url} "/>
                           </div>
                         `;
            }
            return html;
        },
        saveContent(file) {
            
        }
        ,
        /**
         * Добавляет preview файлов в sheet modal
         * @param {type array} files 
         * @param {type JqueryObject} commentingField
         */
        showPreviews: function(files, commentingField) {
           let self = this;
        
           if(this.dynamicSheetModal) {
               this.dynamicSheetModal.close();  
               this.dynamicSheetModal.destroy();
               this.dynamicSheetModal = null;
               
               if(files.length == 0) {
                   return;
               }
           }
          
           let previewsHTML = ``;
           $(files).each((index,file)=>{
             let mainClass = '';
             let beforeImg = '';
             let styleImg = '';
             let classImg = '';
             console.log(file);
              switch(file.preview.placeholder) {
                  case 'audio':
                     mainClass="col-25 placeholder";
                     break;
                  default :
                      styleImg = "width:100px;height:100px;";
                      mainClass="item plugin";
                      
                      beforeImg =`
                     
                      <div class="cancel plugin" data-title="Удалить" data-action="delete" data-index=${index}>
                      <span class="plugin icon icon-cross" data-action="delete" data-index=${index}> </span>
                     </div>
                 <div class="edit plugin" data-title="Редактировать" data-action="edit" data-index=${index}>
                   <span class="plugin icon icon-edit" data-action="edit" data-index=${index}></span>
                 </div>`
                      break;
              }
              previewsHTML += this.createPreviewHtml(file, mainClass, beforeImg,styleImg, classImg, index);
              
           })
          
           this.dynamicSheetModal = app.sheet.create({
            content: '<div class="sheet-modal theme-dark">'+
                        '<div class="toolbar">'+
                          '<div class="toolbar-inner">'+
                            '<div class="left"> <a class="link sheet-upload">Upload</a></div>'+
                            '<div class="right">'+
                              '<a class="link sheet-close">Close</a>'+
                              
                            '</div>'+
                          '</div>'+
                        '</div>'+
                        '<div class="sheet-modal-inner">'+
                          '<div class="page-content"><div class="contentUpload row " style="justify-content:flex-start;">'+  previewsHTML +
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>',
            // Events
            on: {
              open: function (sheet) {
                  /*
                $(".item").each((index,item)=>{
                    let opt = { 
  width:5,
  trail:100,                 
  lines:12,
  opacity:0.25,
  width: 17, // The line thickness
  radius: 10, // The radius of the inner circle
  
  corners: 1, // Corner roundness (0..1)
  color: '#ffffff', // CSS color or array of colors
  
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
 
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 'auto', // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  
  position: 'absolute' // Element positioning
};
                   let a= new Spin.Spinner(opt).spin(item);
                console.log(item);
                
                })
                */
                $('.sheet-upload').click((e)=>{
                    // loadFiles => loadFile
                    $('.sheet-upload').remove();
                    $('.sheet-close').remove();
                    self.loadFiles(files, $('.item'), commentingField);
                })
                $('.item').click((e)=>{
                    
                    if($(e.target).data('action') == 'delete') {

                        self.removeFile($(e.target).data('index'), files);
                        $(e.target).parents('.item').remove();
                        if(files.length == 0) {
                            this.close();  
                            this.destroy();
                            this.dynamicSheetModal = null;
                        }
                    }
                    if($(e.target).data('action') == 'edit') {
                        self.showDynamicPopup(files[$(e.target).data('index')]);
                    }
                })
              },
              
             
              opened: function (sheet) {
               console.log('Sheet opened');
              },
            
           }});
        
           this.dynamicSheetModal.open();
        },

        /**
         * Создает и показывает popup с полями для редактирования файла
         * @param {type File} file 
         * @todo max-height или crop ?
         */
        showDynamicPopup: function(file) {
          let self = this;
          if(this.dynamicPopup) {
              this.dynamicPopup.close();
              this.dynamicPopup.destroy();
              this.dynamicPopup = null;
          } 
          loadImage(file, function(img) {
            
            self.dynamicPopup = app.popup.create({
                content: `
                      <div class="popup plugin">
                          <div class="page plugin">
                             <div class="page-content">
                                <span class="plugin modal-box-title">
                                   Редактировать изображение
                                </span>
                                <span class="plugin icon-close link popup-close" >
                               
                                </span>
   
                                <div class="plugin modal-form">
                                   <div class="centeredImg">
                                   </div>
                                   <div class="plugin input-label">
                                      <label for="form-title">
                                         Заголовок
                                         <span class="plugin optional"> необязательно</span>
                                         
                                      </label>
                                      <input id="form-title" class="plugin text-input" type="text" name="form-title"
                                                value="" maxlength="100">
                                   </div>
                                   <div class="plugin input-label">
                                      <label for="form-description">
                                         Описание
                                         <span class="plugin optional"> необязательно</span>
  
                                      </label>
                                      <textarea id="form-description" class="text-input no-resize plugin"
                                                name="form-description" placeholder="Краткое описание изображения">
                                      </textarea>        
                                   </div>
  
                               </div>
                               <button class="plugin btn btn-input default" data-action="OK">
                                  ОК
                              </button>
                             
                          </div>
                          
                      </div>
  
                
                `,
                on: {
                    open: function() {
                        $(".centeredImg").prepend(img);
                        $('.btn[data-action="OK"]').click((e)=> {
                            let info = {
                                "form-title": $('#form-title').val(),
                                "form-description": $('#form-description').val()
                            }
                            self.editFile(file,info);
                            
                            this.close();
                            this.destroy();
                            self.dynamicPopup = null;              
                            self.dynamicSheetModal.open();
                        })
                        
                    },
                    close: function() {
                      self.dynamicSheetModal.open();
                    }
                }
                
            })
  
            self.dynamicSheetModal.close();
            self.dynamicPopup.open();                    
        }, {maxWidth: 591, maxHeight: 174})
          
        },
        /**
         * Расширяет file переданным info и добавляет метку extended : true
         * @param {type File} file 
         * @param {type Object} info - поля, 
         */
        editFile: function(file, info) {
            file = {...file, ...info};
            file.extended = true;
        },
       /**
        * Ставит состояние всех файлов в START, вызывает анимацию PRELOADER
        * Следит за загрузкой всех файлов. 
        * Если есть хотя бы один файл с неуспешной загрузкой, то возвратит false 
        * @todo дореализовать onRequest
        * @todo продебажжить загрузку изображений с состоянием STATE.LOADING
        * @param {type array} JQueryObjects - objects with images(previews) to animate
        * @param {type JQuery Object} commentingField
        * @return {type boolean} marker - true <=> Promise.all resolved
        */
        loadFiles: function(files, JQueryObjects, commentingField) {
            
            $(files).each((index,file)=>{
                file.state = this.STATES.START;
               
                JQueryObjects.eq(index).append($('<div/>').html(
                    this.ANIMATIONS.PRELOADER));
            })
            $(JQueryObjects).each((index, jq)=> {
                let file = files[$(jq).data("index")];
                console.log(file);
                file.onRequest = {
                    [this.STATES.LOAD] : ()=> {
                       jq.children(".preloader").remove();
                       jq.append("<div/>", this.ANIMATIONS.LOADING(file.state.percent));
                    },
                    [this.STATES.FAIL] : {

                    },
                    [this.STATES.SUCCESS] : {

                    }
                }
                let url;
                switch(file.processType) {
                    case 'image' : 
                       url = this.URLS.MAIN + this.URLS.PHOTO;
                       break;
                }
                 this.requestFile(url, file, file.onRequest);
            })
            
            commentingField.find('.upload').remove();
             
        },
        /**
         * следит за состоянием загрузки 
         * @todo добавить обработчики из handler на каждое из состояний
         * @type {function handler} - хранит обработчики на каждый из состояний
         * @return {bool state} state - одно из значений STATE
         * меняется state у файла preparedFile => меняется анимация
         * 
         */
        requestFile(url, preparedFile, handler) {
            const xhr = new XMLHttpRequest();
            let self = this;
            xhr.onprogress = event => {
            console.log(`Получено ${event.loaded} из ${event.total}`)
            let loaded = preparedFile.state.Loaded = event.loaded;
            let total = preparedFile.state.Total = event.total;
            let percent = loaded / total;
           if(percent < 100) {
                preparedFile.state = self.STATES.LOAD;
                preparedFile.percent  = percent;
                preparedFile.onRequest[self.STATES.LOAD]();

            }
           };
            xhr.onload = function() {
                preparedFile.state = self.STATES.SUCCESS;
            }
            xhr.onerror = function() {
                preparedFile.state = self.STATES.FAIL;
            }
            xhr.open("POST", url+"?source=" + preparedFile.preview.url)
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            
            xhr.send(JSON.stringify({
                'title' : preparedFile.title,
                'description' : preparedFile.description
            }));
        },
        /**
         * 
         * @param {type File} file 
         * @param {type Object} JQueryObject - JQuery object relating to file
         */
        loadFile: function(file, JQueryObject) {
           switch(file.processType) {
               case 'image':
                  
           }
        },
        animateLoading : function(percent) {
            return `
               <div class="percent-block animation">
                  <span class="number">
                    ${percent}
                  </span>
                  <span class="percent">
                     %
                  </span>
               </div>
            `;
        }
        
    };

    $.fn.comments = function(options) {
        return this.each(function() {
            var comments = Object.create(Comments);
            $.data(this, 'comments', comments);
            comments.init(options || {}, this);
        });
    };
   

}));
