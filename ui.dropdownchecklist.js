;(function($) {
    /*
     * ui.dropdownchecklist
     *
     * Copyright (c) 2008-2010 Adrian Tosca, Copyright (c) 2010-2011 Ittrium LLC
     * Dual licensed under the MIT (MIT-LICENSE.txt) OR GPL (GPL-LICENSE.txt) licenses.
     *
     */
    // The dropdown check list jQuery plugin transforms a regular select html element into a dropdown check list.
    $.widget("ui.dropdownchecklist", {
        // Some globlals
        // $.ui.dropdownchecklist.gLastOpened - keeps track of last opened dropdowncheck list so we can close it
        // $.ui.dropdownchecklist.gIDCounter - simple counter to provide a unique ID as needed
        version: function() {
            alert('DropDownCheckList v1.4');
        },
        // Creates the drop container that keeps the items and appends it to the document
        _appendDropContainer: function ( controlItem ) {
            var containerClasses = "ui-dropdownchecklist-dropcontainer ui-widget-content";
            var containerStyle = "overflow-y: auto";
            var container = "<div class='{0}' style='{1}'></div>".format(containerClasses, containerStyle);

            var ddwId = controlItem.attr("id") + '-ddw';
            var wrapperClasses = "ui-widget ui-dropdownchecklist ui-dropdownchecklist-dropcontainer-wrapper";
            var wrapperStyle = "position: absolute;left: -33000px; top: -33000px";

            var wrapper = "<div id='{0}' class='{1}' style='{2}'>{3}</div>".format(ddwId, wrapperClasses, wrapperStyle, container);

            var $wrapper = $(wrapper);
            $wrapper.insertAfter(controlItem);

            // flag that tells if the drop container is shown or not
            $wrapper.isOpen = false;

            return $wrapper;
        },

        // Look for change of focus
        _handleFocus: function(e,focusIn,forDropdown) {
            var self = this;
            if (forDropdown && !self.dropWrapper.isOpen) {
                // if the focus changes when the control is NOT open, mark it to show where the focus is/is not
                e.stopImmediatePropagation();
                if (focusIn) {
                    self.controlSelector.addClass("ui-state-hover");
                    if ($.ui.dropdownchecklist.gLastOpened != null) {
                        $.ui.dropdownchecklist.gLastOpened._toggleDropContainer( false );
                    }
                } else {
                    self.controlSelector.removeClass("ui-state-hover");
                }
            } else if (!forDropdown && !focusIn) {
                // The dropdown is open, and an item (NOT the dropdown) has just lost the focus.
                // we really need a reliable method to see who has the focus as we process the blur,
                // but that mechanism does not seem to exist.  Instead we rely on a delay before
                // posting the blur, with a focus event cancelling it before the delay expires.
                if ( e != null ) { e.stopImmediatePropagation(); }
                self.controlSelector.removeClass("ui-state-hover");
                self._toggleDropContainer( false );
            }
        },
        // Clear the pending change of focus, which keeps us 'in' the control
        _cancelBlur: function(e) {
            var self = this;
            if (self.blurringItem != null) {
                clearTimeout(self.blurringItem);
                self.blurringItem = null;
            }
        },

        _appendControl: function() {
            var self = this, sourceSelect = this.sourceSelect, options = this.options;

            var anIcon = "";
            // the optional icon (which is inherently a block) which we can float
            if (options.icon != null) {
                var iconPlacement = (options.icon.placement == null) ? "left" : options.icon.placement;

                var anIconClasses = "ui-icon {0}".format((options.icon.toOpen != null) ? options.icon.toOpen : "ui-icon-triangle-1-e");
                var anIconStyle = "float: {0}".format(iconPlacement);

                anIcon = "<div class='{0}' style='{1}'></div>".format(anIconClasses, anIconStyle);
            }

            // the text container keeps the control text that is built from the selected (checked) items
            // inline-block needed to prevent long text from wrapping to next line when icon is active
            var textContainerClasses = "ui-dropdownchecklist-text";
            var textContainerStyle = "display: inline-block; white-space: nowrap; overflow: hidden";
            var textContainer = "<span class='{0}' style='{1}'></span>".format(textContainerClasses, textContainerStyle);

            // Setting a tab index means we are interested in the tab sequence
            var tabIndex = sourceSelect.attr("tabIndex");
            if ( tabIndex == null ) {
                tabIndex = 0;
            } else {
                tabIndex = parseInt(tabIndex);
                if ( tabIndex < 0 ) {
                    tabIndex = 0;
                }
            }

            // the actual control which you can style
            // inline-block needed to enable 'width' but has interesting problems cross browser
            var controlClasses = "ui-dropdownchecklist-selector ui-state-default";
            var controlStyle = "display: inline-block; overflow: hidden; white-space: nowrap";
            var control = "<span tabindex='{0}' class='{1}' style='{2}'>{3}{4}</span>".format(tabIndex, controlClasses, controlStyle, anIcon, textContainer);


            // assign an ID
            var baseID = sourceSelect.attr("id");
            if ((baseID == null) || (baseID == "")) {
                baseID = "ddcl-" + $.ui.dropdownchecklist.gIDCounter++;
            } else {
                baseID = "ddcl-" + baseID;
            }

            // the control is wrapped in a basic container
            // inline-block at this level seems to give us better size control
            var wrapperClasses = "ui-dropdownchecklist ui-dropdownchecklist-selector-wrapper ui-widget";
            var wrapperStyle = "display: inline-block; cursor: default; overflow: hidden";
            var wrapper = "<span id='{0}' class='{1}' style='{2}'>{3}</span>".format(baseID, wrapperClasses, wrapperStyle, control);

            var $wrapper = $(wrapper);
            $wrapper.insertAfter(sourceSelect);

            // clicking on the control toggles the drop container
            $wrapper.click(function(event) {
                if (!self.disabled) {
                    //event.stopImmediatePropagation();
                    self._toggleDropContainer( !self.dropWrapper.isOpen );
                }
            });

            return $wrapper;
        },

        _handleElementsEvents: function() {
            //TODO: Handle with events
            /*control.focus(function(e) {self._handleFocus(e,true,true);});
            control.blur(function(e) {self._handleFocus(e,false,true);});*/

            // add the hover styles to the control
            /*wrapper.hover(
                function() {
                    if (!self.disabled) {
                        control.addClass("ui-state-hover");
                    }
                }
                , 	function() {
                    if (!self.disabled) {
                        control.removeClass("ui-state-hover");
                    }
                }
            );*/

            // Watch for a window resize and adjust the control if open
            /*$(window).resize(function() {
                if (!self.disabled && self.dropWrapper.isOpen) {
                    // Reopen yourself to get the position right
                    self._toggleDropContainer(true);
                }
            });*/


            //TODO: Items events
            //label.click(function(e) {e.stopImmediatePropagation();});

            // active items display themselves with hover
            /*item.hover(
                function(e) {
                    var anItem = $(this);
                    if (!anItem.hasClass("ui-state-disabled")) { anItem.addClass("ui-state-hover"); }
                }
                , 	function(e) {
                    var anItem = $(this);
                    anItem.removeClass("ui-state-hover");
                }
            );*/
            // clicking on the checkbox synchronizes the source select
            checkBox.click(function(e) {
                var aCheckBox = $(this);
                e.stopImmediatePropagation();
                if (aCheckBox.hasClass("active") ) {
                    // Active checkboxes take active action
                    var callback = self.options.onItemClick;
                    if ($.isFunction(callback)) try {
                        callback.call(self,aCheckBox,sourceSelect.get(0));
                    } catch (ex) {
                        // reject the change on any error
                        aCheckBox.prop("checked",!aCheckBox.prop("checked"));
                        self._syncSelected(aCheckBox);
                        return;
                    }
                    self._syncSelected(aCheckBox);
                    self.sourceSelect.trigger("change", 'ddcl_internal');
                    if (!self.isMultiple && options.closeRadioOnClick) {
                        self._toggleDropContainer(false);
                    }
                }
            });

            // check/uncheck the item on clicks on the entire item div

            // do not let the focus wander around
            item.focus(function(e) {
                e.stopImmediatePropagation();
            });

            //TODO: Handle close button events
            // close the control on click
            closeItem.click(function(e) {
                var aGroup= $(this);
                e.stopImmediatePropagation();
                // retain the focus even if no action is taken
                aGroup.focus();
                self._toggleDropContainer( false );
            });
            closeItem.hover(
                function(e) { $(this).addClass("ui-state-hover"); }
                , 	function(e) { $(this).removeClass("ui-state-hover"); }
            );
            // do not let the focus wander around
            closeItem.focus(function(e) {
                var aGroup = $(this);
                e.stopImmediatePropagation();
            });


        },

        // Creates a drop item that coresponds to an option element in the source select
        _createDropItem: function(index, tabIndex, value, text, optCss, checked, disabled, indent) {
            var self = this, options = this.options, sourceSelect = this.sourceSelect, controlWrapper = this.controlWrapper;

            // generated id must be a bit unique to keep from colliding
            var idBase = controlWrapper.attr("id");
            var id = idBase + '-i' + index;
            var itemId = 'item-' + index;

            var checkBox;
            var checkedString = checked ? " checked='checked'" : "";
            var classString = disabled ? " class='inactive'" : " class='active'";

            // all items start out disabled to keep them out of the tab order
            if (self.isMultiple) { // the checkbox
                checkBox = "<input index='{0}' value='{1}' disabled type='checkbox' id='" + id + "'" + checkedString + classString + " tabindex='" + tabIndex + "' />";
            } else { // the radiobutton
                checkBox = "<input index='{0}' value='{1}' disabled type='radio' id='" + id + "' name='" + idBase + "'" + checkedString + classString + " tabindex='" + tabIndex + "' />";
            }
            checkBox = checkBox.format(index, value);

            // the text
            var labelClasses = "ui-dropdownchecklist-text";
            var labelStyle = optCss != null ? optCss : "cursor: default";

            var label = "<label for='{0}' class='{1}' style='{2}'>{3}</label>".format(id, labelClasses, labelStyle, text);

            // the item contains a div that contains a checkbox input and a lable for the text
            // the div
            var itemClasses = "ui-dropdownchecklist-item ui-state-default {0} {1}".format(
                indent ? "ui-dropdownchecklist-indent" : "",
                disabled ? "ui-state-disabled" : ""
            );
            var itemStyle = "white-space: nowrap";
            var item = "<div id='{0}' class='{1}' style='{2}'>{3}{4}</div>".format(itemId, itemClasses, itemStyle, checkBox, label);

            return item;
        },
        _createCloseItem: function(text) {

            var labelClasses = "ui-dropdownchecklist-text";
            var labelStyle = "cursor: default";
            var label = "<span class='{0}' style='{1}'>{2}</span>".format(labelClasses, labelStyle, text);

            var closeItemClasses = "ui-state-default ui-dropdownchecklist-close ui-dropdownchecklist-item";
            var closeItemStyle = "white-space: nowrap; text-align: right";
            var closeItem = "<div class='{0}' style='{1}'>{2}</div>".format(closeItemClasses, closeItemStyle, label);

            return closeItem;
        },
        // Creates the drop items and appends them to the drop container
        // Also calculates the size needed by the drop container and returns it
        _appendItems: function() {
            var self = this, config = this.options, sourceSelect = this.sourceSelect, dropWrapper = this.dropWrapper;
            var dropContainerDiv = dropWrapper.find(".ui-dropdownchecklist-dropcontainer");
            var dropContainerDivInnerHtml = "";
            var children = sourceSelect.children();

            for (var index = 0; index < children.length; index++) { // when the select has groups
                var opt = children.eq(index);
                if (opt.is("option")) {
                    var itemHtml = self._generateOption(opt, index, false, false);
                    dropContainerDivInnerHtml += itemHtml;
                }
            }

            if ( config.explicitClose != null ) {
                var closeItemHtml = self._createCloseItem(config.explicitClose);
                dropContainerDivInnerHtml += closeItemHtml;
            }
            var divWidth = dropContainerDiv.outerWidth();
            var divHeight = dropContainerDiv.outerHeight();

            dropContainerDiv.html(dropContainerDivInnerHtml);

            // Adding listeners to items - doing by selecting by id after html was already appended to DOM
            for (var itemIndex = 0; itemIndex < children.length; itemIndex++) { // when the select has groups
                var itemId = 'item-' + itemIndex;
                var $item = $("#{0}".format(itemId), dropContainerDiv);

                $item.click(function(event) {
                    var anItem = $(this);
                    event.stopPropagation();
                    event.stopImmediatePropagation();

                    if (!anItem.hasClass("ui-state-disabled") ) {
                        // check/uncheck the underlying control
                        var aCheckBox = anItem.find("input");
                        var checked = aCheckBox.prop("checked");
                        if (!$(event.target).is("input")) {
                            event.preventDefault();
                            aCheckBox.prop("checked", !checked);
                        }

                        var callback = self.options.onItemClick;
                        if ($.isFunction(callback)) try {
                            callback.call(self,aCheckBox,sourceSelect.get(0));
                        } catch (ex) {
                            // reject the change on any error
                            aCheckBox.prop("checked",checked);
                            self._syncSelected(aCheckBox);
                            return;
                        }
                        self._syncSelected(aCheckBox);
                        self.sourceSelect.trigger("change", 'ddcl_internal');
                        if (!checked && !self.isMultiple && options.closeRadioOnClick) {
                            self._toggleDropContainer(false);
                        }
                    } else {
                        // retain the focus even if disabled
                        anItem.focus();
                        self._cancelBlur();
                    }
                });
            }

            return { width: divWidth, height: divHeight };
        },

        _generateOption: function(option, index, indent, forceDisabled) {
            var self = this;
            var item = "";
            // Note that the browsers destroy any html structure within the OPTION
            var text = option.html();
            if ( (text != null) && (text != '') ) {
                var value = option.val();
                var optCss = option.attr('style');
                var selected = option.prop("selected");
                var disabled = (forceDisabled || option.prop("disabled"));
                // Use the same tab index as the selector replacement
                var tabIndex = self.controlSelector.attr("tabindex");
                item = self._createDropItem(index, tabIndex, value, text, optCss, selected, disabled, indent);
            }
            return item;
        },
        // Synchronizes the items checked and the source select
        // When firstItemChecksAll option is active also synchronizes the checked items
        // senderCheckbox parameters is the checkbox input that generated the synchronization
        _syncSelected: function(senderCheckbox) {
            var self = this, options = this.options, sourceSelect = this.sourceSelect, dropWrapper = this.dropWrapper;
            var selectOptions = sourceSelect.get(0).options;
            var allCheckboxes = dropWrapper.find("input.active");
            if (options.firstItemChecksAll == 'exclusive') {
                if ((senderCheckbox == null) && $(selectOptions[0]).prop("selected") ) {
                    // Initialization call with first item active
                    allCheckboxes.prop("checked", true);
                    $(allCheckboxes[0]).prop("checked", true);
                } else if ((senderCheckbox != null) && (senderCheckbox.attr("index") == 0)) {
                    // Action on the first, so all other checkboxes NOT active
                    var firstIsActive = senderCheckbox.prop("checked");
                    allCheckboxes.prop("checked", firstIsActive);
                } else  {
                    // check the first checkbox if all the other checkboxes are checked
                    var allChecked = true;
                    var firstCheckbox = null;

                    allCheckboxes.each(function(index) {
                        if (index > 0) {
                            var checked = $(this).prop("checked");
                            if (!checked) { allChecked = false; }
                        } else {
                            firstCheckbox = $(this);
                        }
                    });
                    if ( firstCheckbox != null ) {
                        if ( allChecked ) {
                            // when all are checked, only the first left checked
                            allCheckboxes.prop("checked", true);
                        }
                        firstCheckbox.prop("checked", allChecked );
                    }
                }
            } else if (options.firstItemChecksAll) {
                if ((senderCheckbox == null) && $(selectOptions[0]).prop("selected") ) {
                    // Initialization call with first item active so force all to be active
                    allCheckboxes.prop("checked", true);
                } else if ((senderCheckbox != null) && (senderCheckbox.attr("index") == 0)) {
                    // Check all checkboxes if the first one is checked
                    allCheckboxes.prop("checked", senderCheckbox.prop("checked"));
                } else  {
                    // check the first checkbox if all the other checkboxes are checked
                    var allChecked = true;
                    var firstCheckbox = null;
                    allCheckboxes.each(function(index) {
                        if (index > 0) {
                            var checked = $(this).prop("checked");
                            if (!checked) { allChecked = false; }
                        } else {
                            firstCheckbox = $(this);
                        }
                    });
                    if ( firstCheckbox != null ) {
                        firstCheckbox.prop("checked", allChecked );
                    }
                }
            }
            // do the actual synch with the source select
            var empties = 0;
            allCheckboxes = dropWrapper.find("input");
            allCheckboxes.each(function(index) {
                var anOption = $(selectOptions[index + empties]);
                var optionText = anOption.html();
                if ( (optionText == null) || (optionText == '') ) {
                    empties += 1;
                    anOption = $(selectOptions[index + empties]);
                }
                anOption.prop("selected", $(this).prop("checked"));
            });
            // update the text shown in the control
            self._updateControlText();

            // Ensure the focus stays pointing where the user is working
            if ( senderCheckbox != null) { senderCheckbox.focus(); }
        },
        _sourceSelectChangeHandler: function(event) {
            var self = this, dropWrapper = this.dropWrapper;
            dropWrapper.find("input").val(self.sourceSelect.val());

            // update the text shown in the control
            self._updateControlText();
        },
        // Updates the text shown in the control depending on the checked (selected) items
        _updateControlText: function() {
            var self = this, sourceSelect = this.sourceSelect, options = this.options, controlWrapper = this.controlWrapper;
            var firstOption = sourceSelect.find("option:first");
            var selectOptions = sourceSelect.find("option");
            var text = self._formatText(selectOptions, options.firstItemChecksAll, firstOption);
            var controlLabel = controlWrapper.find(".ui-dropdownchecklist-text");
            controlLabel.html(text);
            // the attribute needs naked text, not html
            controlLabel.attr("title", controlLabel.text());
        },
        // Formats the text that is shown in the control
        _formatText: function(selectOptions, firstItemChecksAll, firstOption) {
            var text;
            if ( $.isFunction(this.options.textFormatFunction) ) {
                // let the callback do the formatting, but do not allow it to fail
                try {
                    text = this.options.textFormatFunction(selectOptions);
                } catch(ex) {
                    alert( 'textFormatFunction failed: ' + ex );
                }
            } else if (firstItemChecksAll && (firstOption != null) && firstOption.prop("selected")) {
                // just set the text from the first item
                text = firstOption.html();
            } else {
                // concatenate the text from the checked items
                text = "";
                selectOptions.each(function() {
                    if ($(this).prop("selected")) {
                        if ( text != "" ) { text += ", "; }
                        /* NOTE use of .html versus .text, which can screw up ampersands for IE */
                        var optCss = $(this).attr('style');
                        var tempspan = $('<span/>');
                        tempspan.html( $(this).html() );
                        if ( optCss == null ) {
                            text += tempspan.html();
                        } else {
                            tempspan.attr('style',optCss);
                            text += $("<span/>").append(tempspan).html();
                        }
                    }
                });
                if ( text == "" ) {
                    text = (this.options.emptyText != null) ? this.options.emptyText : "&nbsp;";
                }
            }
            return text;
        },
        // Shows and hides the drop container
        _toggleDropContainer: function( makeOpen ) {
            var self = this;
            // hides the last shown drop container
            var hide = function(instance) {
                if ((instance != null) && instance.dropWrapper.isOpen ){
                    instance.dropWrapper.isOpen = false;
                    $.ui.dropdownchecklist.gLastOpened = null;

                    var config = instance.options;
                    instance.dropWrapper.css({
                        top: "-33000px",
                        left: "-33000px"
                    });
                    var aControl = instance.controlSelector;
                    aControl.removeClass("ui-state-active");
                    aControl.removeClass("ui-state-hover");

                    var anIcon = instance.controlWrapper.find(".ui-icon");
                    if ( anIcon.length > 0 ) {
                        anIcon.removeClass( (config.icon.toClose != null) ? config.icon.toClose : "ui-icon-triangle-1-s");
                        anIcon.addClass( (config.icon.toOpen != null) ? config.icon.toOpen : "ui-icon-triangle-1-e");
                    }

                    $(document).unbind("click");

                    // keep the items out of the tab order by disabling them
                    instance.dropWrapper.find("input.active").prop("disabled",true);

                    // the following blur just does not fire???  because it is hidden???  because it does not have focus???
                    //instance.sourceSelect.trigger("blur");
                    //instance.sourceSelect.triggerHandler("blur");
                    if($.isFunction(config.onComplete)) { try {
                        config.onComplete.call(instance,instance.sourceSelect.get(0));
                    } catch(ex) {
                        alert( 'callback failed: ' + ex );
                    }}
                }
            };
            // shows the given drop container instance
            var show = function(instance) {
                if ( !instance.dropWrapper.isOpen ) {
                    instance.dropWrapper.isOpen = true;
                    $.ui.dropdownchecklist.gLastOpened = instance;

                    var config = instance.options;
                    /**** Issue127 (and the like) to correct positioning when parent element is relative
                     ****	This positioning only worked with simple, non-relative parent position
                     instance.dropWrapper.css({
	                    top: instance.controlWrapper.offset().top + instance.controlWrapper.outerHeight() + "px",
	                    left: instance.controlWrapper.offset().left + "px"
	                });
                     ****/
                    if ((config.positionHow == null) || (config.positionHow == 'absolute')) {
                        /** Floats above subsequent content, but does NOT scroll */
                        instance.dropWrapper.css({
                            position: 'absolute'
                            ,   top: instance.controlWrapper.position().top + instance.controlWrapper.outerHeight() + "px"
                            ,   left: instance.controlWrapper.position().left + "px"
                        });
                    } else if (config.positionHow == 'relative') {
                        /** Scrolls with the parent but does NOT float above subsequent content */
                        instance.dropWrapper.css({
                            position: 'relative'
                            ,   top: "0px"
                            ,   left: "0px"
                        });
                    }
                    var zIndex = 0;
                    if (config.zIndex == null) {
                        var ancestorsZIndexes = instance.controlWrapper.parents().map(
                            function() {
                                var zIndex = $(this).css("z-index");
                                return isNaN(zIndex) ? 0 : zIndex; }
                        ).get();
                        var parentZIndex = Math.max.apply(Math, ancestorsZIndexes);
                        if ( parentZIndex >= 0) zIndex = parentZIndex+1;
                    } else {
                        /* Explicit set from the optins */
                        zIndex = parseInt(config.zIndex);
                    }
                    if (zIndex > 0) {
                        instance.dropWrapper.css( { 'z-index': zIndex } );
                    }

                    var aControl = instance.controlSelector;
                    aControl.addClass("ui-state-active");
                    aControl.removeClass("ui-state-hover");

                    var anIcon = instance.controlWrapper.find(".ui-icon");
                    if ( anIcon.length > 0 ) {
                        anIcon.removeClass( (config.icon.toOpen != null) ? config.icon.toOpen : "ui-icon-triangle-1-e");
                        anIcon.addClass( (config.icon.toClose != null) ? config.icon.toClose : "ui-icon-triangle-1-s");
                    }

                    setTimeout(function () {
                        $(document).bind("click", function(e) {
                            hide(instance);
                        });
                    }, 1);

                    // insert the items back into the tab order by enabling all active ones
                    var activeItems = instance.dropWrapper.find("input.active");
                    activeItems.prop("disabled",false);

                    // we want the focus on the first active input item
                    var firstActiveItem = activeItems.get(0);
                    if ( firstActiveItem != null ) {
                        firstActiveItem.focus();
                    }
                }
            };
            if ( makeOpen ) {
                hide($.ui.dropdownchecklist.gLastOpened);
                show(self);
            } else {
                hide(self);
            }
        },
        // Set the size of the control and of the drop container
        _setSize: function(dropCalculatedSize) {
            var options = this.options, dropWrapper = this.dropWrapper, controlWrapper = this.controlWrapper;

            // use the width from config options if set, otherwise set the same width as the drop container
            var controlWidth = dropCalculatedSize.width;
            if (options.width != null) {
                controlWidth = parseInt(options.width);
            } else if (options.minWidth != null) {
                var minWidth = parseInt(options.minWidth);
                // if the width is too small (usually when there are no items) set a minimum width
                if (controlWidth < minWidth) {
                    controlWidth = minWidth;
                }
            }
            var control = this.controlSelector;
            control.css({ width: controlWidth + "px" });

            // if we size the text, then Firefox places icons to the right properly
            // and we do not wrap on long lines
            var controlText = control.find(".ui-dropdownchecklist-text");
            var controlIcon = control.find(".ui-icon");
            if ( controlIcon != null ) {
                // Must be an inner/outer/border problem, but IE6 needs an extra bit of space,
                // otherwise you can get text pushed down into a second line when icons are active
                controlWidth -= (controlIcon.outerWidth() + 4);
                controlText.css( { width: controlWidth + "px" } );
            }
            // Account for padding, borders, etc
            controlWidth = controlWrapper.outerWidth();

            // the drop container height can be set from options
            var maxDropHeight = (options.maxDropHeight != null)
                ? parseInt(options.maxDropHeight)
                : -1;
            var dropHeight = ((maxDropHeight > 0) && (dropCalculatedSize.height > maxDropHeight))
                ? maxDropHeight
                : dropCalculatedSize.height;
            // ensure the drop container is not less than the control width (would be ugly)
            var dropWidth = dropCalculatedSize.width < controlWidth ? controlWidth : dropCalculatedSize.width;

            $(dropWrapper).css({
                height: dropHeight + "px",
                width: dropWidth + "px"
            });
        },
        // Initializes the plugin
        _init: function() {
            var self = this, options = this.options;
            if ( $.ui.dropdownchecklist.gIDCounter == null) {
                $.ui.dropdownchecklist.gIDCounter = 1;
            }
            // item blurring relies on a cancelable timer
            self.blurringItem = null;

            // sourceSelect is the select on which the plugin is applied
            var sourceSelect = self.element;
            self.initialDisplay = sourceSelect.css("display");
            sourceSelect.css("display", "none");
            self.initialMultiple = sourceSelect.prop("multiple");
            self.isMultiple = self.initialMultiple;
            if (options.forceMultiple != null) { self.isMultiple = options.forceMultiple; }
            sourceSelect.prop("multiple", true);
            self.sourceSelect = sourceSelect;

            // append the control that resembles a single selection select
            var controlWrapper = self._appendControl();
            self.controlWrapper = controlWrapper;
            self.controlSelector = controlWrapper.find(".ui-dropdownchecklist-selector");

            // create the drop container where the items are shown
            var dropWrapper = self._appendDropContainer(controlWrapper);
            self.dropWrapper = dropWrapper;

            // append the items from the source select element
            var dropCalculatedSize = self._appendItems();

            // updates the text shown in the control
            self._updateControlText(controlWrapper, dropWrapper, sourceSelect);

            // set the sizes of control and drop container
            self._setSize(dropCalculatedSize);

            // look for possible auto-check needed on first item
            if ( options.firstItemChecksAll ) {
                self._syncSelected(null);
            }
            // BGIFrame for IE6
            if (options.bgiframe && typeof self.dropWrapper.bgiframe == "function") {
                self.dropWrapper.bgiframe();
            }
            // listen for change events on the source select element
            // ensure we avoid processing internally triggered changes
            self.sourceSelect.change(function(event, eventName) {
                if (eventName != 'ddcl_internal') {
                    self._sourceSelectChangeHandler(event);
                }
            });
        },
        // Refresh the disable and check state from the underlying control
        _refreshOption: function(item,disabled,selected) {
            var aParent = item.parent();
            // account for enabled/disabled
            if ( disabled ) {
                item.prop("disabled",true);
                item.removeClass("active");
                item.addClass("inactive");
                aParent.addClass("ui-state-disabled");
            } else {
                item.prop("disabled",false);
                item.removeClass("inactive");
                item.addClass("active");
                aParent.removeClass("ui-state-disabled");
            }
            // adjust the checkbox state
            item.prop("checked",selected);
        },
        // External command to explicitly close the dropdown
        close: function() {
            this._toggleDropContainer(false);
        },
        // External command to refresh the ddcl from the underlying selector
        refresh: function() {
            var self = this, sourceSelect = this.sourceSelect, dropWrapper = this.dropWrapper;

            var allCheckBoxes = dropWrapper.find("input");

            var optionCount = 0;
            sourceSelect.children().each(function(index) {
                var opt = $(this);
                var disabled = opt.prop("disabled");
                if (opt.is("option")) {
                    var selected = opt.prop("selected");
                    var anItem = $(allCheckBoxes[optionCount]);
                    self._refreshOption(anItem, disabled, selected);
                    optionCount += 1;
                }
            });
            // sync will handle firstItemChecksAll and updateControlText
            self._syncSelected(null);
        },
        // External command to enable the ddcl control
        enable: function() {
            this.controlSelector.removeClass("ui-state-disabled");
            this.disabled = false;
        },
        // External command to disable the ddcl control
        disable: function() {
            this.controlSelector.addClass("ui-state-disabled");
            this.disabled = true;
        },
        // External command to destroy all traces of the ddcl control
        destroy: function() {
            $.Widget.prototype.destroy.apply(this, arguments);
            this.sourceSelect.css("display", this.initialDisplay);
            this.sourceSelect.prop("multiple", this.initialMultiple);
            this.controlWrapper.unbind().remove();
            this.dropWrapper.remove();
        }
    });

    $.extend($.ui.dropdownchecklist, {
        defaults: {
            width: null
            ,   maxDropHeight: null
            ,   firstItemChecksAll: false
            ,   closeRadioOnClick: false
            ,   minWidth: 50
            ,   positionHow: 'absolute'
            ,   bgiframe: false
            ,	explicitClose: null
        }
    });

})(jQuery);