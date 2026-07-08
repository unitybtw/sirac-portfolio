import bpy
print("--- OBJECTS IN SCENE ---")
for obj in bpy.context.scene.objects:
    print(f"NAME: '{obj.name}' TYPE: {obj.type}")
print("------------------------")
