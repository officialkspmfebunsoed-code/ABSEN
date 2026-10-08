$code = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;

public class IconConverter
{
    public static void Convert(string inputPath, string outputPath)
    {
        using (Image image = Image.FromFile(inputPath))
        {
            using (Bitmap bitmap = new Bitmap(image.Width, image.Height))
            {
                using (Graphics g = Graphics.FromImage(bitmap))
                {
                    g.Clear(Color.White);
                    g.DrawImage(image, 0, 0, image.Width, image.Height);
                }
                bitmap.Save(outputPath, ImageFormat.Png);
            }
        }
    }
}
"@
Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing
[IconConverter]::Convert("assets\logo.png", "assets\logo_white.png")
