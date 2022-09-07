# frozen_string_literal: true

module Primer
  module Alpha
    # :nodoc:
    class ActionList < Primer::Component
      DEFAULT_ROLE = :list
      DEFAULT_TAG = :ul

      DEFAULT_SCHEME = :full
      SCHEME_MAPPINGS = {
        DEFAULT_SCHEME => nil,
        :inset => "ActionListWrap--inset"
      }.freeze
      SCHEME_OPTIONS = SCHEME_MAPPINGS.keys.freeze

      def self.custom_element_name
        @custom_element_name ||= name.split("::").last.underscore.dasherize
      end

      def custom_element_name
        self.class.custom_element_name
      end

      renders_many :items, lambda { |**system_arguments|
        build_item(**system_arguments, root: nil).tap do |item|
          will_add_item(item)
        end
      }

      renders_many :groups, lambda { |**system_arguments|
        build_group(**system_arguments).tap do |group|
          will_add_group(group)
        end
      }

      def initialize(tag: DEFAULT_TAG, role: DEFAULT_ROLE, item_classes: nil, scheme: DEFAULT_SCHEME, show_dividers: false, **system_arguments)
        @system_arguments = system_arguments
        @system_arguments[:tag] = tag
        @system_arguments[:role] = role
        @item_classes = item_classes
        @scheme = fetch_or_fallback(SCHEME_OPTIONS, scheme, DEFAULT_SCHEME)
        @show_dividers = show_dividers
        system_arguments[:classes] = class_names(
          SCHEME_MAPPINGS[@scheme],
          "ActionListWrap",
          "ActionListWrap--divided" => @show_dividers
        )
      end

      def build_item(**system_arguments)
        system_arguments[:classes] = class_names(
          @item_classes,
          system_arguments[:classes]
        )

        ActionList::Item.new(list: self, **system_arguments)
      end

      def build_group(**system_arguments)
        ActionList::Group.new(list: self, **system_arguments)
      end

      def will_add_item(_item); end

      def will_add_group(_group); end
    end
  end
end