# frozen_string_literal: true

module Primer
  module Alpha
    # Add a general description of component here
    # Add additional usage considerations or best practices that may aid the user to use the component correctly.
    # @accessibility Add any accessibility considerations
    class SegmentedControl < Primer::Component
      status :alpha

      ICON_ONLY_DEFAULT = false
      ICON_ONLY_OPTIONS = [ICON_ONLY_DEFAULT, true, :when_narrow].freeze

      # Use to render a button and an associated panel slot. See the example below or refer to <%= link_to_component(Primer::Navigation::TabComponent) %>.
      #
      # @param system_arguments [Hash] <%= link_to_system_arguments_docs %>
      renders_many :buttons, lambda { |system_arguments|
        Primer::Alpha::SegmentedControl::Button.new(icon_only: @icon_only, **system_arguments)
      }

      # @example Basic usage
      #
      #   <%= render(Primer::SegmentedControl.new) do |c| %>
      #     <%= c.button(text: "Button 1", selected: true) %>
      #     <%= c.button(text: "Button 2") %>
      #     <%= c.button(text: "Button 3") %>
      #   <% end %>
      #
      # @param icon_only [Boolean] If the buttons should only have an icon
      # @param full_width [Boolean] If the component should be full width
      # @param system_arguments [Hash] <%= link_to_system_arguments_docs %>
      def initialize(icon_only: ICON_ONLY_DEFAULT, full_width: false, **system_arguments)
        @icon_only = fetch_or_fallback(ICON_ONLY_OPTIONS, icon_only, ICON_ONLY_DEFAULT)
        @system_arguments = system_arguments
        @system_arguments[:tag] = "segmented-control"
        @system_arguments[:classes] = class_names(
          "SegmentedControl",
          system_arguments[:classes],
          "SegmentedControl--fullWidth": full_width,
          "SegmentedControl--iconOnly-whenNarrow": @icon_only == :when_narrow
        )

        @icon_only = false if @icon_only == :when_narrow
      end
    end
  end
end
