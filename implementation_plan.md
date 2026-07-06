# Goal
Enable the Field Guide web app to capture, store, and beautifully render matplotlib visualizations (or any generated images) created by your Python lessons.

## User Review Required
> [!IMPORTANT]
> The scripts will need to generate image files (e.g., `plt.savefig("plot.png")`) instead of opening interactive GUI windows (`plt.show()`). If a script calls `plt.show()`, it could hang the automated capture process waiting for someone to close the window.
> Does this workflow sound good to you? If so, simply approve the plan and I'll implement it.

## Proposed Changes

### Environment
- **Install matplotlib**: I will run `pip install matplotlib` so the environment has the necessary plotting tools.

### `webapp/scripts/capture-outputs.mjs`
- **Detect Images**: After a Python script finishes running in the `scratchDir`, the script will scan the directory for generated image files (`.png`, `.jpg`, `.svg`).
- **Store Images**: It will create a folder in `webapp/public/outputs/[Lesson_Path]/` and move the images there so the web app can serve them statically.
- **Cache Updates**: It will add an `images` array containing the image URLs to `output-cache.json` for that specific script.

### `webapp/src/lib/outputs.ts`
- **Type Definitions**: Add an optional `images?: string[]` property to the `CapturedOutput` interface.

### `webapp/src/components/code/OutputPanel.tsx`
- **UI Update**: Modify the output panel so that if a script generated images, they are rendered elegantly in a scrollable or stacked view directly below the raw console text.

### `Deep_Learning_PyTorch/2_linear_regression.py`
- **Add Plotting**: Re-add the `matplotlib` import and generate a beautiful plot comparing the actual data (blue dots) vs the model's learned predictions (red line).
- **Save Image**: Add `plt.savefig("regression_plot.png")` at the end of the script.

## Verification Plan
1. `npm run capture-outputs` will be executed.
2. We'll verify that `regression_plot.png` is generated, captured, and correctly routed to `webapp/public/...`.
3. We'll check the web app to ensure the visual output renders beautifully below the stdout in the "Run" panel.
