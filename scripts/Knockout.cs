using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

public static class Knockout {
  public static void Run(string path, byte threshold) {
    using (var src = new Bitmap(path)) {
      var bmp = new Bitmap(src.Width, src.Height, PixelFormat.Format32bppArgb);
      using (var g = Graphics.FromImage(bmp)) {
        g.DrawImage(src, 0, 0, src.Width, src.Height);
      }

      int w = bmp.Width, h = bmp.Height;
      var rect = new Rectangle(0, 0, w, h);
      var data = bmp.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
      int stride = data.Stride;
      int bytes = Math.Abs(stride) * h;
      byte[] px = new byte[bytes];
      Marshal.Copy(data.Scan0, px, 0, bytes);

      bool[] visited = new bool[w * h];
      var q = new Queue<int>();

      Action<int,int> tryEnq = (x, y) => {
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        int idx = y * w + x;
        if (visited[idx]) return;
        int o = y * stride + x * 4;
        byte b = px[o], gch = px[o + 1], r = px[o + 2];
        byte max = r;
        if (gch > max) max = gch;
        if (b > max) max = b;
        if (max > threshold) return;
        visited[idx] = true;
        q.Enqueue(idx);
      };

      for (int x = 0; x < w; x++) { tryEnq(x, 0); tryEnq(x, h - 1); }
      for (int y = 0; y < h; y++) { tryEnq(0, y); tryEnq(w - 1, y); }

      while (q.Count > 0) {
        int idx = q.Dequeue();
        int x = idx % w;
        int y = idx / w;
        int o = y * stride + x * 4;
        px[o] = 0; px[o + 1] = 0; px[o + 2] = 0; px[o + 3] = 0;
        tryEnq(x + 1, y); tryEnq(x - 1, y); tryEnq(x, y + 1); tryEnq(x, y - 1);
      }

      // Soft edge near holes
      for (int y = 1; y < h - 1; y++) {
        for (int x = 1; x < w - 1; x++) {
          int o = y * stride + x * 4;
          if (px[o + 3] == 0) continue;
          byte max = px[o + 2];
          if (px[o + 1] > max) max = px[o + 1];
          if (px[o] > max) max = px[o];
          if (max > 60) continue;
          bool near = false;
          int[] n = new int[] { 1,0, -1,0, 0,1, 0,-1 };
          for (int i = 0; i < 4; i++) {
            int nx = x + n[i * 2], ny = y + n[i * 2 + 1];
            if (px[ny * stride + nx * 4 + 3] == 0) { near = true; break; }
          }
          if (near) px[o + 3] = (byte)Math.Min(255, max * 4);
        }
      }

      Marshal.Copy(px, 0, data.Scan0, bytes);
      bmp.UnlockBits(data);

      string tmp = path + ".tmp.png";
      bmp.Save(tmp, ImageFormat.Png);
      bmp.Dispose();
      File.Delete(path);
      File.Move(tmp, path);
      Console.WriteLine("ok " + Path.GetFileName(path));
    }
  }
}
