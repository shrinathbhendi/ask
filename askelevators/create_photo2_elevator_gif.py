import os
import math
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

def generate_elevator_gif():
    image_path = r'C:\Users\ME\.gemini\antigravity-ide\brain\1d1e6f0f-28d0-417a-a0d6-291e981731b5\media__1791012072966.jpg'
    
    # Load base image (Photo 2)
    base_raw = Image.open(image_path).convert('RGB')
    
    target_w, target_h = 450, 675
    base_img = base_raw.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    w, h = target_w, target_h
    
    # Door opening bounding box in scaled coordinates
    door_x1 = int(w * 0.248) # ~112 px
    door_x2 = int(w * 0.755) # ~340 px
    door_y1 = int(h * 0.104) # ~70 px
    door_y2 = int(h * 0.900) # ~607 px
    
    door_w = door_x2 - door_x1
    door_h = door_y2 - door_y1
    half_door_w = (door_w // 2) + 3
    
    # Create realistic brushed stainless steel door panels
    def create_door_panel(panel_w, panel_h, is_left=True):
        panel = Image.new('RGB', (panel_w, panel_h), (210, 215, 222))
        draw = ImageDraw.Draw(panel)
        
        # 1. Metallic sheen matching Photo 2 frame tone
        for x in range(panel_w):
            norm_x = (x / panel_w) if is_left else (1.0 - x / panel_w)
            sheen = int(170 + math.sin(norm_x * math.pi) * 60)
            warm_r = min(255, sheen + 15)
            warm_g = min(255, sheen + 10)
            warm_b = min(255, sheen)
            draw.line([(x, 0), (x, panel_h)], fill=(warm_r, warm_g, warm_b))
            
        # 2. Vertical steel grain texture lines
        for y in range(0, panel_h, 2):
            alpha = 14 if (y % 4 == 0) else 6
            line_color = (255, 255, 255)
            # Overlay grain line
            for x in range(panel_w):
                r, g, b = panel.getpixel((x, y))
                panel.putpixel((x, y), (min(255, r + alpha), min(255, g + alpha), min(255, b + alpha)))
            
        # 3. Top ceiling light reflection (warm bright glow at top of doors)
        for y in range(50):
            glow_ratio = (1.0 - y / 50.0) ** 1.8
            for x in range(panel_w):
                r, g, b = panel.getpixel((x, y))
                nr = int(r * (1.0 - glow_ratio) + 255 * glow_ratio)
                ng = int(g * (1.0 - glow_ratio) + 245 * glow_ratio)
                nb = int(b * (1.0 - glow_ratio) + 210 * glow_ratio)
                panel.putpixel((x, y), (nr, ng, nb))
            
        # 4. Floor light reflection (warm glow at bottom of doors)
        for y in range(panel_h - 40, panel_h):
            dist = (y - (panel_h - 40)) / 40.0
            for x in range(panel_w):
                r, g, b = panel.getpixel((x, y))
                nr = int(r * (1.0 - dist * 0.4) + 245 * (dist * 0.4))
                ng = int(g * (1.0 - dist * 0.4) + 235 * (dist * 0.4))
                nb = int(b * (1.0 - dist * 0.4) + 215 * (dist * 0.4))
                panel.putpixel((x, y), (nr, ng, nb))
            
        # 5. Panel edge bevels & black rubber center gasket
        if is_left:
            draw.rectangle([panel_w - 4, 0, panel_w, panel_h], fill=(25, 28, 32))
            draw.line([(panel_w - 5, 0), (panel_w - 5, panel_h)], fill=(255, 250, 240), width=1)
            draw.line([(0, 0), (panel_w - 5, 0)], fill=(240, 245, 250), width=2)
            draw.line([(0, panel_h - 1), (panel_w - 5, panel_h - 1)], fill=(100, 105, 110), width=2)
        else:
            draw.rectangle([0, 0, 4, panel_h], fill=(25, 28, 32))
            draw.line([(4, 0), (4, panel_h)], fill=(255, 250, 240), width=1)
            draw.line([(5, 0), (panel_w, 0)], fill=(240, 245, 250), width=2)
            draw.line([(5, panel_h - 1), (panel_w, panel_h - 1)], fill=(100, 105, 110), width=2)
            
        return panel.convert('RGBA')

    left_door_img = create_door_panel(half_door_w, door_h, is_left=True)
    right_door_img = create_door_panel(half_door_w, door_h, is_left=False)
    
    # 6. Outer frame mask (keeps the outer border clean while keeping interior 100% OPAQUE)
    frame_mask = Image.new('L', (w, h), 0)
    draw_fm = ImageDraw.Draw(frame_mask)
    draw_fm.rounded_rectangle([22, 16, w - 22, h - 26], radius=6, fill=255)
    
    frames = []
    
    # Timeline: Open -> Closing -> Closed -> Opening
    timeline = []
    
    # 1. Open pause (12 frames) - interior fully illuminated
    for _ in range(12):
        timeline.append(1.0)
        
    # 2. Closing (16 frames)
    for i in range(1, 17):
        t = i / 16.0
        ease_t = 0.5 * (1.0 - math.cos(t * math.pi))
        timeline.append(1.0 - ease_t)
        
    # 3. Closed pause (12 frames)
    for _ in range(12):
        timeline.append(0.0)
        
    # 4. Opening (16 frames)
    for i in range(1, 17):
        t = i / 16.0
        ease_t = 0.5 * (1.0 - math.cos(t * math.pi))
        timeline.append(ease_t)
        
    center_seam_x = door_x1 + (door_w // 2)
    
    for open_factor in timeline:
        # Base frame is the Photo 2 solid bright illuminated interior & frame
        frame = base_img.copy().convert('RGBA')
        
        # Calculate door positions
        left_closed_x = center_seam_x - half_door_w
        left_open_x = door_x1 - half_door_w
        left_curr_x = int(left_closed_x + open_factor * (left_open_x - left_closed_x))
        
        right_closed_x = center_seam_x
        right_open_x = door_x2
        right_curr_x = int(right_closed_x + open_factor * (right_open_x - right_closed_x))
        
        # Door layer (solid opaque door panels)
        door_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        door_layer.paste(left_door_img, (left_curr_x, door_y1), left_door_img)
        door_layer.paste(right_door_img, (right_curr_x, door_y1), right_door_img)
        
        # Door mask clips door movement strictly inside door_x1..door_x2
        door_mask = Image.new('L', (w, h), 0)
        draw_dm = ImageDraw.Draw(door_mask)
        draw_dm.rectangle([door_x1, door_y1, door_x2, door_y2], fill=255)
        
        frame.paste(door_layer, (0, 0), door_mask)
        
        # Overlay light effects (bright ceiling light strip, vertical seam light leak)
        light_overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        draw_light = ImageDraw.Draw(light_overlay)
        
        # Bright ceiling LED strip glow above doors
        draw_light.rectangle([door_x1 + 6, door_y1 - 3, door_x2 - 6, door_y1 + 5], fill=(255, 245, 200, 210))
        
        # Seam light leak when doors are closing/closed
        if open_factor < 0.95:
            seam_alpha = int((1.0 - open_factor) * 160)
            draw_light.line([(center_seam_x, door_y1), (center_seam_x, door_y2)], fill=(255, 245, 210, seam_alpha), width=2)
            
        frame = Image.alpha_composite(frame, light_overlay)
        
        # Apply outer frame mask to clip only the exterior black background
        final_canvas = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        final_canvas.paste(frame, (0, 0), frame_mask)
        
        # Convert to RGB with white background (or clean alpha) to eliminate GIF transparency bleed!
        bg_white = Image.new('RGB', (w, h), (255, 255, 255))
        bg_white.paste(final_canvas, (0, 0), final_canvas)
        
        frames.append(bg_white.convert('P', palette=Image.Palette.ADAPTIVE))
        
    out_dir = os.path.join('assets', 'images')
    gif_path = os.path.join(out_dir, 'elevator-doors.gif')
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=65,
        loop=0
    )
    print(f"Opaque Bright Illuminated Elevator GIF saved to {gif_path}. Total frames: {len(frames)}")

if __name__ == '__main__':
    generate_elevator_gif()
