# Widgets

Widget system consists of two component modes:

1. Editor for editing existing grid and aging removing components onto it
2. Display widgets - for static displaying components from earlier created layouts.

Both represented by generic `WidgetsComponent` that can accept set of props.

## Props

- `editable: boolean`, defines is it a widgets display page or editor
- `data: any`, optional - for passing widgets data directly for displaying widgets
- `user_id: string`, optional - to display widgets that are cusomised by/for specific user

## Widgets editing/creation component

To use editor you need to import `WidgetsComponent` from `@juicyllama/frontend-core` and pass a prop `:editable="true"` or just `editable`

Default sizing of widgets can be as follows:

- Small (3/12 on desktop / 6/12 mobile)
- Medium (6/12 on desktop / 12/12 mobile)
- Large (12/12 on desktop / 12/12 mobile)

Each widget contains following fields:

- Title, client name for widget
- Desciption, client description for widget
- Content (enum) - JLTable / JLForm / JLStats / JLChart / etc
- Page to display a widget
- Size (enum)

Order of placing a widget and size of a widget (S/M/L) can be edited in a visual editor.

## Widgets display component

To use you need to import `WidgetsComponent` from `@juicyllama/frontend-core` and set value of source for widgets data.
