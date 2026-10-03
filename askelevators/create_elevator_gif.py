import os
import math
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

def create_elevator_gif():
    width = 500
    height = 320
    center_x = width // 2
    door_width = width // 2
    
    # 1. Load cabin image for inside
    cabin_path = os.path.join('assets', 'images', 'gallery', 'cabin.png')
    if os.path.exists(cabin_path):
        inside_img = Image.open(cabin_path).convert('RGB')
        inside_img = inside_img.resize((width, height), Image.Resampling.LANCZOS)
    else:
        # Fallback illuminated interior if image is missing
        inside_img = Image.new('RGB', (width, height), (30, 30, 35))
        draw_in = ImageDraw.Draw(inside_img)
        draw_in.rectangle([20, 20, width-20, height-20], fill=(60, 50, 45), outline=(200, 160, 100), width=3)
    
    # Brighten interior slightly for glowing effect
    enhancer = ImageEnhance.Brightness(inside_img)
    inside_img = enhancer.enhance(1.15)
    
    # 2. Create brushed stainless steel door texture
    door_left_base = Image.new('RGBA', (door_width, height), (180, 185, 192, 255))
    door_right_base = Image.new('RGBA', (door_width, height), (175, 180, 188, 255))
    
    draw_l = ImageDraw.Draw(door_left_base)
    draw_r = ImageDraw.Draw(door_right_base)
    
    # Add vertical steel grain lines & panel bevels
    for y in range(0, height, 4):
        alpha = 15 if (y % 8 == 0) else 5
        draw_l.line([(0, y), (door_width, y)], fill=(255, 255, 255, alpha))
        draw_r.line([(0, y), (door_width, y)], fill=(255, 255, 255, alpha))
        
    for x in range(0, door_width, 6):
        alpha = 10 if (x % 12 == 0) else 4
        draw_l.line([(x, 0), (x, height)], fill=(0, 0, 0, alpha))
        draw_r.line([(x, 0), (x, height)], fill=(0, 0, 0, alpha))
        
    # Bevel borders & center black rubber edge
    # Left door right edge (center seam)
    draw_l.rectangle([door_width-4, 0, door_width, height], fill=(40, 42, 45, 255))
    draw_l.line([(0, 0), (door_width-5, 0)], fill=(230, 235, 240, 255), width=2)
    draw_l.line([(0, height-1), (door_width-5, height-1)], fill=(100, 105, 110, 255), width=2)
    
    # Right door left edge (center seam)
    draw_r.rectangle([0, 0, 4, height], fill=(40, 42, 45, 255))
    draw_r.line([(5, 0), (door_width, 0)], fill=(230, 235, 240, 255), width=2)
    draw_r.line([(5, height-1), (door_width, height-1)], fill=(100, 105, 110, 255), width=2)

    # Steel door handles / vertical metallic trim
    draw_l.rectangle([door_width-28, 40, door_width-14, height-40], fill=(210, 215, 222, 255), outline=(120, 125, 130, 255), width=1)
    draw_r.rectangle([14, 40, 28, height-40], fill=(205, 210, 218, 255), outline=(120, 125, 130, 255), width=1)
    
    frames = []
    
    # Define animation timeline (in progress 0.0 to 1.0)
    # Closed -> Opening -> Open -> Closing -> Closed
    progress_steps = []
    
    # 1. Closed pause (6 frames)
    for _ in range(6):
        progress_steps.append(0.0)
        
    # 2. Opening (14 frames, smooth easing)
    for i in range(1, 15):
        t = i / 14.0
        # Smooth easeInOutSine
        ease_t = 0.5 * (1.0 - math.cos(t * math.pi))
        progress_steps.append(ease_t)
        
    # 3. Fully Open pause (10 frames)
    for _ in range(10):
        progress_steps.append(1.0)
        
    # 4. Closing (14 frames)
    for i in range(1, 15):
        t = i / 14.0
        ease_t = 0.5 * (1.0 - math.cos(t * math.pi))
        progress_steps.append(1.0 - ease_t)
        
    for open_factor in progress_steps:
        # Create base canvas with interior
        frame = inside_img.copy().convert('RGBA')
        
        # Calculate door positions based on open_factor (0.0 = closed, 1.0 = fully open)
        shift = int(open_factor * door_width)
        
        left_x = -shift
        right_x = center_x + shift
        
        # Paste doors
        frame.paste(door_left_base, (left_x, 0), door_left_base)
        frame.paste(door_right_base, (right_x, 0), door_right_base)
        
        # Draw frame shadow over interior edge when opening
        if open_factor > 0:
            overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
            draw_ov = ImageDraw.Draw(overlay)
            # Door shadows
            if shift < door_width:
                # Shadow on interior from left door edge
                draw_ov.rectangle([center_x - shift, 0, center_x - shift + 12, height], fill=(0, 0, 0, int(90 * (1 - open_factor))))
                # Shadow on interior from right door edge
                draw_ov.rectangle([center_x + shift - 12, 0, center_x + shift, height], fill=(0, 0, 0, int(90 * (1 - open_factor))))
            frame = Image.alpha_composite(frame, overlay)
            
        frames.append(frame.convert('P', palette=Image.Palette.ADAPTIVE))
        
    output_path = os.path.join('assets', 'images', 'elevator-doors.gif')
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=70,  # ~14 fps smooth animation
        loop=0
    )
    print(f"GIF saved successfully to {output_path}. Total frames: {len(frames)}")

if __name__ == '__main__':
    create_elevator_gif()
